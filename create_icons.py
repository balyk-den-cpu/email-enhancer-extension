#!/usr/bin/env python3
"""
Создание иконок для браузерного расширения Email Enhancer
"""

from PIL import Image, ImageDraw, ImageFont
import os

def create_icon(size, output_path):
    """Создает иконку заданного размера"""
    # Создаем изображение с прозрачным фоном
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Основной фон - синий круг
    margin = size // 8
    draw.ellipse([margin, margin, size - margin, size - margin], 
                 fill=(26, 115, 232, 255))  # #1a73e8
    
    # Белый конверт в центре
    envelope_margin = size // 4
    envelope_width = size - 2 * envelope_margin
    envelope_height = envelope_width * 0.7
    
    # Позиция конверта
    env_x = envelope_margin
    env_y = (size - envelope_height) // 2
    
    # Рисуем конверт
    # Основа конверта
    draw.rectangle([env_x, env_y, env_x + envelope_width, env_y + envelope_height], 
                   fill=(255, 255, 255, 255), outline=(255, 255, 255, 255))
    
    # Треугольник крышки конверта
    center_x = env_x + envelope_width // 2
    triangle_height = envelope_height // 3
    draw.polygon([
        (env_x, env_y),
        (center_x, env_y + triangle_height),
        (env_x + envelope_width, env_y)
    ], fill=(26, 115, 232, 255))
    
    # Маленький зеленый кружок с галочкой (AI enhancement indicator)
    if size >= 32:
        check_size = size // 6
        check_x = size - check_size - margin // 2
        check_y = size - check_size - margin // 2
        
        # Зеленый кружок
        draw.ellipse([check_x, check_y, check_x + check_size, check_y + check_size], 
                     fill=(52, 168, 83, 255))  # #34a853
        
        # Белая галочка
        if size >= 48:
            check_margin = check_size // 4
            draw.line([check_x + check_margin, check_y + check_size // 2,
                      check_x + check_size // 2, check_y + check_size - check_margin], 
                     fill=(255, 255, 255, 255), width=max(1, size // 32))
            draw.line([check_x + check_size // 2, check_y + check_size - check_margin,
                      check_x + check_size - check_margin, check_y + check_margin], 
                     fill=(255, 255, 255, 255), width=max(1, size // 32))
    
    # Сохраняем иконку
    img.save(output_path, 'PNG')
    print(f"Создана иконка {size}x{size}: {output_path}")

def main():
    """Создает все необходимые иконки"""
    # Создаем директорию assets если её нет
    os.makedirs('assets', exist_ok=True)
    
    # Размеры иконок для браузерного расширения
    sizes = [16, 32, 48, 128]
    
    for size in sizes:
        output_path = f'assets/icon{size}.png'
        create_icon(size, output_path)
    
    print("Все иконки созданы успешно!")

if __name__ == '__main__':
    main()
