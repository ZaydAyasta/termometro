"""
Genera iconos PNG para la PWA usando solo la biblioteca estándar de Python.
Crea un icono de termómetro con el emoji 🌡️ representado geométricamente.
"""
import struct, zlib, math

def make_png(size, filename):
    """Genera un PNG de tamaño 'size x size' con fondo degradado y termómetro."""
    w = h = size
    img = []

    for y in range(h):
        row = []
        for x in range(w):
            cx, cy = w / 2, h / 2
            # Background gradient: light blue to light purple
            t = y / h
            r = int(87 + t * (91 - 87))
            g = int(134 + t * (38 - 134))
            b = int(229 + t * (229 - 229))

            # Thermometer tube geometry
            tube_x1 = int(w * 0.40)
            tube_x2 = int(w * 0.60)
            tube_y1 = int(h * 0.10)
            tube_y2 = int(h * 0.72)
            bulb_cx  = int(w * 0.50)
            bulb_cy  = int(h * 0.80)
            bulb_r   = int(w * 0.14)

            in_tube  = (tube_x1 <= x <= tube_x2) and (tube_y1 <= y <= tube_y2)
            in_bulb  = math.sqrt((x - bulb_cx)**2 + (y - bulb_cy)**2) <= bulb_r

            # Fill color inside tube (gradient warm-to-cool)
            fill_ratio = (y - tube_y1) / max(tube_y2 - tube_y1, 1)
            fill_r = int(250 + fill_ratio * (86 - 250))
            fill_g = int(100 + fill_ratio * (184 - 100))
            fill_b = int(74  + fill_ratio * (237 - 74))

            if in_bulb:
                row += [220, 80, 60, 255]
            elif in_tube:
                inner_x1 = tube_x1 + max(1, int(w * 0.03))
                inner_x2 = tube_x2 - max(1, int(w * 0.03))
                if inner_x1 <= x <= inner_x2:
                    row += [fill_r, fill_g, fill_b, 255]
                else:
                    row += [30, 50, 90, 255]
            else:
                # Rounded corners on bg
                row += [r, g, b, 255]
        img.append(row)

    # Build raw PNG bytes
    def write_chunk(chunk_type, data):
        c = chunk_type + data
        crc = zlib.crc32(c) & 0xffffffff
        return struct.pack('>I', len(data)) + c + struct.pack('>I', crc)

    header = b'\x89PNG\r\n\x1a\n'
    ihdr_data = struct.pack('>IIBBBBB', w, h, 8, 2, 0, 0, 0)  # 8-bit RGB... wait
    # Use RGBA (color type 6)
    ihdr_data = struct.pack('>IIBBBBB', w, h, 8, 6, 0, 0, 0)
    ihdr = write_chunk(b'IHDR', ihdr_data)

    raw = b''
    for row in img:
        raw += b'\x00'  # filter type None
        raw += bytes(row)
    compressed = zlib.compress(raw, 9)
    idat = write_chunk(b'IDAT', compressed)
    iend = write_chunk(b'IEND', b'')

    with open(filename, 'wb') as f:
        f.write(header + ihdr + idat + iend)
    print(f"Created: {filename} ({size}x{size})")

# Generate both required sizes
make_png(192, 'icons/icon-192.png')
make_png(512, 'icons/icon-512.png')
print("Icons generated successfully.")
