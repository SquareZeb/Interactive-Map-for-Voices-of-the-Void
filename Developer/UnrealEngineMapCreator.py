import pyautogui
import keyboard
import time
from PIL import Image
import os
import shutil
import os
pyautogui.FAILSAFE = False
global YRange
global XRange
global startPosX
global startPosY
global start_x, start_Y
global crop_width, crop_height
global save_directory
global save_directory2
global x_index, y_index
global output_image_path
YRange = 140
XRange = 140
placement_interval = 148
save_directory = "Screenshots"
save_directory2 = "Finalized"
os.makedirs(save_directory, exist_ok=True)
os.makedirs(save_directory2, exist_ok=True)
def process():
    def createimage():
        start_x, start_y = 431, 11
        crop_width, crop_height = 1058, 1058
        startPosX = -70000
        startPosY = -70000
        canvas_width, canvas_height = 22260, 1058
        x_index, y_index = 0, 0
        for i in range(YRange):
            canvas = Image.new('RGB', (canvas_width, canvas_height), color=(255, 255, 255))
            for j in range(XRange):
                keyboard.press('capslock')
                time.sleep(0.1)
                keyboard.release('capslock')
                pyautogui.press('`')
                pyautogui.typewrite(f"bugitgo {startPosX} {startPosY} 87587 -90 -90")
                pyautogui.press('enter')
                keyboard.press('capslock')
                time.sleep(0.1)
                keyboard.release('capslock')
                time.sleep(0.1)
                screenshot = pyautogui.screenshot()
                cropped_image = screenshot.crop((start_x, start_y, start_x + crop_width, start_y + crop_height))
                filename = f"{x_index}_{y_index}.png"
                file_path = os.path.join(save_directory, filename)
                cropped_image.save(file_path)
                print(f"Saved {file_path}")
                startPosX += 1000
                x_index += 1
                if os.path.exists(file_path):
                    cropped_image = Image.open(file_path)
                    x_pos = x_index * 146
                    y_pos = y_index * 0
                    canvas.paste(cropped_image, (x_pos, y_pos))
                else:
                    print(f"File {file_path} not found!")
            output_image_path = f"final_image{y_index}.png"
            output_image_path = os.path.join(save_directory2, output_image_path)
            canvas.save(output_image_path)
            x_index = 0
            startPosX = -70000
            y_index += 1
            startPosY += 1000
    def combineimages():
        y_index = 0
        canvas_width, canvas_height = 22260, 22260
        placement_interval = 148
        canvas = Image.new('RGB', (canvas_width, canvas_height), color=(255, 255, 255))
        y_index = 0
        output_image_path = "final_image.png"
        for j in range(YRange):
            image_path = f"final_image{y_index}.png"
            image_path = os.path.join(save_directory2, image_path)
            if os.path.exists(image_path):
                cropped_image = Image.open(image_path)
                x_pos = 146
                y_pos = y_index * 144
                canvas.paste(cropped_image, (x_pos, y_pos))
            else:
                print(f"File {image_path} not found!")
            y_index += 1
        canvas.save(output_image_path)
    def click_sequence():
        pyautogui.moveTo(172, 1064)
        pyautogui.click()
        time.sleep(0.5)
        for i in range(50):
            pyautogui.click()
        pyautogui.moveTo(1162, 766)
        pyautogui.click()
        time.sleep(0.5)
        for i in range(100):
            pyautogui.click()    
        pyautogui.moveTo(135, 554)
        pyautogui.click()
        time.sleep(0.5)
        pyautogui.moveTo(1219, 381)
        pyautogui.click()
        time.sleep(0.5)
        pyautogui.moveTo(903, 324)
        pyautogui.click()
        time.sleep(0.5)
        pyautogui.moveTo(777, 724)
        pyautogui.click()
        time.sleep(3.0)
        pyautogui.press('z')
        pyautogui.moveTo(938, 518)
        for i in range(7):
            pyautogui.click()
        pyautogui.moveTo(960, 362)
        pyautogui.click()
        pyautogui.moveTo(958, 329)
        pyautogui.click()
        keyboard.press('windows')
        time.sleep(0.1)
        keyboard.release('windows')
        time.sleep(0.1)
        pyautogui.moveTo(123, 1058)
        pyautogui.click()
        time.sleep(5.0)
        pyautogui.moveTo(746, 405)
        pyautogui.click()
        time.sleep(0.5)
        pyautogui.moveTo(411, 434)
        pyautogui.click()
        time.sleep(0.5)
        pyautogui.press('z')
        pyautogui.press('`')
        pyautogui.typewrite("bugitgo 207 1873 6346 -45 90")
        pyautogui.press('enter')
        time.sleep(0.1)
        pyautogui.press('e')
        time.sleep(0.1)
        pyautogui.press('enter')
        time.sleep(0.1)
        pyautogui.press('escape')
        time.sleep(0.1)
        pyautogui.press('`')
        pyautogui.typewrite("slomo 20.0")
        pyautogui.press('enter')
        time.sleep(5.0)
        pyautogui.press('`')
        pyautogui.typewrite("slomo 1.0")
        pyautogui.press('enter')
        pyautogui.press('`')
        pyautogui.typewrite("fov 10")
        pyautogui.press('enter')
        pyautogui.press('`')
        pyautogui.typewrite("bugitgo 70000 70000 87587 -90 -90")
        pyautogui.press('enter')
        pyautogui.press('`')
        pyautogui.typewrite("slomo 0")
        pyautogui.press('enter')
        time.sleep(0.1)
        keyboard.press('capslock')
        time.sleep(0.1)
        keyboard.release('capslock')
        keyboard.press('tab')
        time.sleep(0.1)
        keyboard.release('tab')
    click_sequence()
    createimage()
    shutil.rmtree(save_directory)
    combineimages()
    shutil.rmtree(save_directory2)
print("Press 's' to start the sequence.")
keyboard.wait('s')
process()