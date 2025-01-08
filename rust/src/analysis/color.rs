use js_sys;
use rand::Rng;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
#[derive(Debug, Clone)]
pub struct Color {
    pub r: u8,
    pub g: u8,
    pub b: u8,
}

#[wasm_bindgen]
#[derive(Debug, Clone, Copy)]
pub struct ColorBalance {
    red_percentage: f64,
    green_percentage: f64,
    blue_percentage: f64,
}

// Remove wasm_bindgen from ColorHistograms since we'll handle the conversion manually
#[derive(Debug, Clone)]
pub struct ColorHistograms {
    red: Vec<u32>,
    green: Vec<u32>,
    blue: Vec<u32>,
}

// Remove the direct field exposure and handle through getters
#[wasm_bindgen]
#[derive(Debug)]
pub struct ImageAnalysis {
    histograms: ColorHistograms, // Note: removed pub
    balance: ColorBalance,
    grayscale_average: f64,
}

#[wasm_bindgen]
impl ImageAnalysis {
    // Convert the histograms to a JavaScript object when requested
    #[wasm_bindgen(getter)]
    pub fn histograms(&self) -> JsValue {
        let obj = js_sys::Object::new();
        js_sys::Reflect::set(&obj, &"red".into(), &self.histograms.red.clone().into()).unwrap();
        js_sys::Reflect::set(&obj, &"green".into(), &self.histograms.green.clone().into()).unwrap();
        js_sys::Reflect::set(&obj, &"blue".into(), &self.histograms.blue.clone().into()).unwrap();
        obj.into()
    }

    #[wasm_bindgen(getter)]
    pub fn balance(&self) -> JsValue {
        let obj = js_sys::Object::new();
        js_sys::Reflect::set(
            &obj,
            &"redPercentage".into(),
            &JsValue::from(self.balance.red_percentage),
        )
        .unwrap();
        js_sys::Reflect::set(
            &obj,
            &"greenPercentage".into(),
            &JsValue::from(self.balance.green_percentage),
        )
        .unwrap();
        js_sys::Reflect::set(
            &obj,
            &"bluePercentage".into(),
            &JsValue::from(self.balance.blue_percentage),
        )
        .unwrap();
        obj.into()
    }

    #[wasm_bindgen(getter)]
    pub fn grayscale_average(&self) -> f64 {
        self.grayscale_average
    }
}

const COLOR_DEPTH: usize = 4;

/// Helper function to calculate the distance between two points in 3D space (RGB values)
/// This uses the Euclidean distance formula: sqrt((x₁-x₂)² + (y₁-y₂)² +  (z₁-z₂)²)
fn euclid_dist(p1: &[f64], p2: &[f64]) -> f64 {
    p1.iter()
        .zip(p2.iter())
        .map(|(x, y)| (x - y).powi(2))
        .sum::<f64>()
        .sqrt()
}

/// Checks if two sets of centroids are equal (within a small margin of error)
/// Used to determine if the k-means clustering has converged
fn arrays_equal(a1: &Vec<Vec<f64>>, a2: &Vec<Vec<f64>>) -> bool {
    let epsilon = 1e-10;

    if a1.len() != a2.len() {
        return false;
    }

    a1.iter().zip(a2.iter()).all(|(a, b)| {
        a.len() == b.len()
            && a.iter()
                .zip(b.iter())
                .all(|(x, y)| (x - y).abs() <= epsilon)
    })
}

/// Calculates the average color saturation of an image
///
/// # Arguments
/// * `pixels` - Raw pixel data in RGBA format (4 bytes per pixel)
///
///
/// # Returns
/// * A value between 0 (grayscale) and 1 (fully saturated)
#[wasm_bindgen]
pub fn calc_saturation(pixels: &[u8]) -> f64 {
    let mut tot_saturation = 0.0;
    let pixel_cnt = (pixels.len() / 4) as f64;

    for chunk in pixels.chunks(4) {
        let r = f64::from(chunk[0]) / 255.0;
        let g = f64::from(chunk[1]) / 255.0;
        let b = f64::from(chunk[2]) / 255.0;

        let max = r.max(g).max(b);
        let min = r.min(g).min(b);

        let lightness = (max + min) / 2.0;

        let saturation = if max == min {
            0.0
        } else if lightness <= 0.5 {
            (max - min) / (max + min)
        } else {
            (max - min) / (2.0 - max - min)
        };

        tot_saturation += saturation;
    }

    tot_saturation / pixel_cnt
}

/// Finds the k most dominant colors in an image using k-means clustering
///
/// # Arguments
/// * `pixels` - Raw pixel data in RGBA format (4 bytes per pixel)
/// * `k` - The number of dominant colors to find
/// * `max_iter` - The maximum number of iterations to run the k-means algorithm
///
/// # Returns
/// * Vector of the k most dominant colors found in the image
#[wasm_bindgen]
pub fn find_dominant_colors(pixels: &[u8], k: u32, max_iter: u32) -> js_sys::Array {
    let colors = find_dominant_colors_internal(pixels, k, max_iter);
    let result = js_sys::Array::new();

    for color in colors {
        let obj = js_sys::Object::new();
        js_sys::Reflect::set(&obj, &"r".into(), &JsValue::from(color.r)).unwrap();
        js_sys::Reflect::set(&obj, &"g".into(), &JsValue::from(color.g)).unwrap();
        js_sys::Reflect::set(&obj, &"b".into(), &JsValue::from(color.b)).unwrap();
        result.push(&obj);
    }

    result
}

// Internal function that handles the actual computation
fn find_dominant_colors_internal(pixels: &[u8], k: u32, max_iter: u32) -> Vec<Color> {
    let points: Vec<Vec<f64>> = pixels
        .chunks(4)
        .map(|chunk| {
            vec![
                f64::from(chunk[0]), // Red
                f64::from(chunk[1]), // Green
                f64::from(chunk[2]), // Blue
            ]
        })
        .collect();

    let mut rng = rand::thread_rng();

    let mut centroids: Vec<Vec<f64>> = (0..k)
        .map(|_| {
            let random_index = rng.gen_range(0..points.len());
            points[random_index].clone()
        })
        .collect();

    for _ in 0..max_iter {
        let mut clusters: Vec<Vec<Vec<f64>>> = vec![Vec::new(); k as usize];
        for point in &points {
            let mut min_distance = f64::INFINITY;
            let mut closest_centroid_index = 0;

            for (index, centroid) in centroids.iter().enumerate() {
                let distance = euclid_dist(point, centroid);
                if distance < min_distance {
                    min_distance = distance;
                    closest_centroid_index = index;
                }
            }

            clusters[closest_centroid_index].push(point.clone());
        }

        let new_centroids: Vec<Vec<f64>> = clusters
            .iter()
            .map(|cluster| {
                if cluster.is_empty() {
                    centroids[0].clone() // Avoid empty clusters
                } else {
                    // Calculate average position of all points in cluster
                    let sum = cluster.iter().fold(vec![0.0; 3], |acc, point| {
                        acc.iter().zip(point.iter()).map(|(a, b)| a + b).collect()
                    });
                    sum.iter()
                        .map(|&val| (val / cluster.len() as f64).round())
                        .collect()
                }
            })
            .collect();

        if arrays_equal(&centroids, &new_centroids) {
            break;
        }
        centroids = new_centroids;
    }

    centroids
        .iter()
        .map(|centroid| Color {
            r: centroid[0] as u8,
            g: centroid[1] as u8,
            b: centroid[2] as u8,
        })
        .collect()
}

/// Analyzes the color distribution and characteristics of an image from its raw pixel data.
///
/// # Arguments
///
/// * `pixels` - A slice of bytes representing the image pixels in RGBA format (4 bytes per pixel)
///
/// # Returns
///
/// A `JsValue` containing an object with the following properties:
///
/// * `histograms` - RGB channel histograms showing the frequency distribution of color values
/// * `balance` - The relative percentage of red, green and blue in the image
/// * `grayscaleAverage` - The average grayscale value across all pixels
///
/// # Example
///
/// ```no_run
/// use wasm_bindgen::JsValue;
/// let pixels: Vec<u8> = vec![/* RGBA pixel data */];
/// let analysis = analyze_image_colors(&pixels);
/// ```
#[wasm_bindgen]
pub fn analyze_image_colors(pixels: &[u8]) -> JsValue {
    let mut analysis = ImageAnalysis {
        histograms: ColorHistograms {
            red: vec![0; 256],
            green: vec![0; 256],
            blue: vec![0; 256],
        },
        balance: ColorBalance {
            red_percentage: 0.0,
            green_percentage: 0.0,
            blue_percentage: 0.0,
        },
        grayscale_average: 0.0,
    };

    let mut total_gray = 0.0;
    let mut total_red = 0;
    let mut total_green = 0;
    let mut total_blue = 0;

    for chunk in pixels.chunks(COLOR_DEPTH) {
        let r = chunk[0] as usize;
        let g = chunk[1] as usize;
        let b = chunk[2] as usize;

        analysis.histograms.red[r] += 1;
        analysis.histograms.green[g] += 1;
        analysis.histograms.blue[b] += 1;

        let gray =
            0.299 * f64::from(chunk[0]) + 0.587 * f64::from(chunk[1]) + 0.114 * f64::from(chunk[2]);
        total_gray += gray;

        total_red += chunk[0] as u64;
        total_green += chunk[1] as u64;
        total_blue += chunk[2] as u64;
    }

    let total_pixels = (pixels.len() / 4) as f64;
    analysis.grayscale_average = total_gray / total_pixels;
    let total_all_colors = (total_red + total_green + total_blue) as f64;

    analysis.balance = ColorBalance {
        red_percentage: (total_red as f64 / total_all_colors) * 100.0,
        green_percentage: (total_green as f64 / total_all_colors) * 100.0,
        blue_percentage: (total_blue as f64 / total_all_colors) * 100.0,
    };

    let obj = js_sys::Object::new();
    js_sys::Reflect::set(&obj, &"histograms".into(), &analysis.histograms().into()).unwrap();
    js_sys::Reflect::set(&obj, &"balance".into(), &analysis.balance().into()).unwrap();
    js_sys::Reflect::set(
        &obj,
        &"grayscaleAverage".into(),
        &JsValue::from(analysis.grayscale_average),
    )
    .unwrap();

    obj.into()
}
