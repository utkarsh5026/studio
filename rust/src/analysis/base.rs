use wasm_bindgen::prelude::*;

#[wasm_bindgen]
#[derive(Debug)]
pub struct ImageDimensions {
    pub width: f64,
    pub height: f64,
}

const BYTES_IN_KB: i32 = 1024;

fn gcd(a: f64, b: f64) -> f64 {
    if b == 0.0 {
        a
    } else {
        gcd(b, a % b)
    }
}

#[wasm_bindgen]
pub fn calculate_aspect_ratio(width: f64, height: f64) -> ImageDimensions {
    let divisor = gcd(width, height);
    ImageDimensions {
        width: width / divisor,
        height: height / divisor,
    }
}

#[wasm_bindgen]
pub fn format_file_size(size_in_bytes: f64) -> String {
    let units = ["B", "KB", "MB"];
    let mut unit_idx = 0;
    let mut size = size_in_bytes;

    while size >= BYTES_IN_KB as f64 && unit_idx < units.len() - 1 {
        size /= BYTES_IN_KB as f64;
        unit_idx += 1;
    }

    format!("{:.2} {}", size, units[unit_idx])
}

#[wasm_bindgen]
pub fn calculate_average_luminance(data: &[u8], width: u32, height: u32) -> f64 {
    let mut sum = 0.0;

    for chunk in data.chunks(4) {
        if chunk.len() >= 3 {
            let r = chunk[0] as f64;
            let g = chunk[1] as f64;
            let b = chunk[2] as f64;

            sum += 0.299 * r + 0.587 * g + 0.114 * b;
        }
    }

    let total_pixels = (width * height) as f64;
    sum / total_pixels / 255.0
}
