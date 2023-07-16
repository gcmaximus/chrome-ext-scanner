import os
import time
import json
import datetime

from selenium.webdriver import ActionChains
from selenium.webdriver.common.by import By
from selenium.webdriver.support.wait import WebDriverWait
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver import Chrome, ChromeOptions
from selenium.webdriver.chrome.service import Service

from functools import reduce

import logging


# from main import payload_logging

# Chrome Extension Entry points
# 1) window.name
# 2) location.href
# 3) location.search
# 4) location.hash
# 5) contextMenu
# 6) onMessage
# 7) onConnect
# 8) chrome.tabs.query
# 9) chrome.tabs.get
# 10) chrome.getCurrent
# 11) window.addEventListerner.message
# 12) chrome.runtime.onConnectExternal
# 13) chrome.debugger.getTargets
# 14) chrome.runtime.onMessageExternal 
# logging framework

# magic function (name to be changed)
def nomagic(chain, payload):
    keys = chain.split('.')[1:]
    obj = json.dumps(reduce(lambda x, y: {y: x}, reversed(keys), payload))
    return obj


#####################
# Logging Framework #
#####################

def setup_logger(log_file):
    # Create a logger
    logger = logging.getLogger()
    logger.setLevel(logging.ERROR)

    # Create a file handler and set the log level
    file_handler = logging.FileHandler(log_file)
    file_handler.setLevel(logging.CRITICAL)

    # Create a formatter and add it to the handlers
    log_format = '%(message)s'
    formatter = logging.Formatter(log_format)
    file_handler.setFormatter(formatter)

    # Add the handlers to the logger
    logger.addHandler(file_handler)

    return logger

def payload_logging(outcome, source, extension_id, extension_name, url_of_website, payload_type, payload, time_of_injection, time_of_alert, payload_filename, packet_info):
    # Convert sets to lists
    payload = str(payload)
    packet_info = str(packet_info)

    payload_log = {
        "outcome": outcome,
        "source": source,
        "extensionId": extension_id,
        "extensionName": extension_name,
        "Url": url_of_website,
        "payloadType": payload_type,
        "payload": payload,
        "timeOfInjection": time_of_injection,
        "timeOfAlert": time_of_alert,
        "payload_fileName": payload_filename,
        "packetInfo": packet_info
    }

    log_message = json.dumps(payload_log)
    logger.critical(log_message)


logger = setup_logger('DYNAMIC_ANALYSIS_v2/dynamic_logs.txt')


##########################
# Case Scenario headless #
##########################

# 1) runtime.onMessage 
def runtime_onM(option, ext_id, url_path, payload, result):
    scripts = []
    for k in payload:
        dots = '.'
        taintsink = result["sink"]
        obj = {}
        var = ""
        if dots in taintsink:
            obj = nomagic(taintsink,k)
            var = f"obj = JSON.parse('{obj}');"
        else:
            var = f"obj = '{k}';"

        script = f"{var}chrome.runtime.sendMessage(obj)"
        scripts.append(script)
    
    driver = Chrome(service=Service(), options=option)
    source = 'chrome.runtime.onMessage'
    url_of_injection_example = 'https://www.example.com'
    payload_file = 'small_payload.txt'

    try:
        # Navigate to example.com
        driver.get(url_of_injection_example)
        example = driver.current_window_handle

        # Wait up to 5 seconds for the title to become "Example Domain"
        title_condition = EC.title_is('Example Domain')
        WebDriverWait(driver, 5).until(title_condition)

        # get page source code of example.com
        example_source_code = driver.page_source

        # get extension popup.html
        driver.switch_to.new_window('tab')
        driver.get(url_path)
        extension = driver.current_window_handle

        # get page source code of extension
        extension_source_code = driver.page_source

        for script in scripts:
            # for runtime.onMessage, scripts shall be executed in the chrome extension popup
            try:
                driver.execute_script(script)
                time_of_injection = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S,%f")
            except Exception as e:
                print(' !!!! PAYLOAD FAILLED !!!!')
                print('Error: ', str(e))
                continue
            # check for alerts in example
            driver.switch_to.window(example)
            try:
                # wait 2 seconds to see if alert is detected
                WebDriverWait(driver, 2).until(EC.alert_is_present())
                alert = driver.switch_to.alert
                alert.accept()
                print('[extension] + Alert Detected +')

                # get time of success [2) extension]
                time_of_success = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S,%f")
                payload_logging("SUCCESS", source, ext_id, 'h1-replacer(v3)', url_of_injection_example, 'normal', payload, time_of_injection, time_of_success, payload_file, 'nil')
            except TimeoutException:
                print('[extension] = No alerts detected =')
                payload_logging("FAILURE", source, ext_id, 'h1-replacer(v3)', url_of_injection_example, 'normal', payload, time_of_injection, 'nil', payload_file, 'nil')

            try: 
                # check modifications for example.com
                driver.switch_to.window(example)
                if example_source_code != driver.page_source:
                    driver.get("https://www.example.com")
                    print("Navigated back to 'https://www.example.com' due to page source changes")
            except:
                driver.refresh()

            try: 
                # check modifications for extension
                driver.switch_to.window(extension)
                if extension_source_code != driver.page_source:
                    driver.get(url_path)
                    print(f"Navigated back to '{url_path}' due to extension page source changes")
            except:
                print('error')
            # refresh popup.html
            driver.refresh()
    except TimeoutException:
        # Handle TimeoutException when title condition is not met
        print("Timeout: Title was not resolved to 'Example Domain'")
    except Exception as e:
        # Handle any other exceptions that occur
        print("An error occurred:", str(e))

# 2) runtime.onConnect
def runtime_onC(option, ext_id, url_path, payload, result):
    scripts = []
    for i in payload:
        dots = '.'
        taintsink = result["sink"]
        obj = {}
        var = ""
        func = ""
        connect = ""
        try:
            if result["metavars"]["PORT"]:
                port = result["metavars"]["PORT"]
        except:
            port = ""
        try:
            if result["metavars"]["PORTPROPERTY"]:
                portproperty = result["metavars"]["PORTPROPERTY"]
        except:
            portproperty = ""
        try:
            if result["metavars"]["PORTPASSWORD"]:
                portpassword = result["metavars"]["PORTPASSWORD"]
        except:
            portpassword = ""
        if dots in taintsink:
            obj = nomagic(taintsink,i)
        else:
            obj = i

        if port!="" and portproperty!="" and portpassword!="":
            connect = {portproperty:portpassword}
            connect = json.dumps(connect)

        var = f"obj = JSON.parse('{obj}');"
        func = f".postMessage(obj)"

        script = f"{var}chrome.runtime.connect({connect}){func}"
        scripts.append(script)
    driver = Chrome(service=Service(), options=option)
    source = 'chrome.runtime.onConnect'
    url_of_injection_example = 'https://www.example.com'
    payload_file = 'small_payload.txt'

    try:
        # Navigate to example.com
        driver.get(url_of_injection_example)
        example = driver.current_window_handle

        # Wait up to 5 seconds for the title to become "Example Domain"
        title_condition = EC.title_is('Example Domain')
        WebDriverWait(driver, 5).until(title_condition)

        # get page source code of example.com
        example_source_code = driver.page_source

        # get extension popup.html
        driver.switch_to.new_window('tab')
        driver.get(url_path)
        extension = driver.current_window_handle

        # get page source code of extension
        extension_source_code = driver.page_source

        for script in scripts:
            # for runtime.onConnect, scripts shall be executed in the chrome extension popup
            try:
                driver.execute_script(script)
                time_of_injection = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S,%f")
            except Exception as e:
                print(' !!!! PAYLOAD FAILLED !!!!')
                print('Error: ', str(e))
                continue
            # check for alerts in example
            driver.switch_to.window(example)
            try:
                # wait 2 seconds to see if alert is detected
                WebDriverWait(driver, 2).until(EC.alert_is_present())
                alert = driver.switch_to.alert
                alert.accept()
                print('[extension] + Alert Detected +')

                # get time of success [2) extension]
                time_of_success = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S,%f")
                payload_logging("SUCCESS", source, ext_id, 'h1-replacer(v3)', url_of_injection_example, 'normal', payload, time_of_injection, time_of_success, payload_file, 'nil')
            except TimeoutException:
                print('[extension] = No alerts detected =')
                payload_logging("FAILURE", source, ext_id, 'h1-replacer(v3)', url_of_injection_example, 'normal', payload, time_of_injection, 'nil', payload_file, 'nil')

            try: 
                # check modifications for example.com
                driver.switch_to.window(example)
                if example_source_code != driver.page_source:
                    driver.get("https://www.example.com")
                    print("Navigated back to 'https://www.example.com' due to page source changes")
            except:
                driver.refresh()

            try: 
                # check modifications for extension
                driver.switch_to.window(extension)
                if extension_source_code != driver.page_source:
                    driver.get(url_path)
                    print(f"Navigated back to '{url_path}' due to extension page source changes")
            except:
                print('error')
            # refresh popup.html
            driver.refresh()
    except TimeoutException:
        # Handle TimeoutException when title condition is not met
        print("Timeout: Title was not resolved to 'Example Domain'")
    except Exception as e:
        # Handle any other exceptions that occur
        print("An error occurred:", str(e))

# 3) cookies.get && cookies.getAll
def cookie_get(option, ext_id, url_path, payload, result):
    scripts = []
    for i in payload:
        dots = '.'
        taintsource = result["source"]
        cookie = ""
        x = ""
        try:
            if result["metavars"]["COOKIE"]:
                cookie = result["metavars"]["COOKIE"]
            if result["metavars"]["X"]:
                x = result["metavars"]["X"]
            if result["metavars"]["Y"]:
                y = result["metavars"]["Y"]
            try:
                if result["metavars"]["yvalue"]:
                    yvalue = result["metavars"]["yvalue"]
            except:
                yvalue = ""
        except:
            y = ""
        
        obj = ""
        if cookie in taintsource and taintsource == x:
            if dots in x:
                var = x.split(dots)
                if var[1] == "name":
                    obj = f'{i}=value;'
                elif var[1] == "value":
                    obj = f'cookie={i};'                
        elif cookie in taintsource and taintsource == y:
            if dots in y:
                var = x.split(dots)
                if var[1] == "name":
                    obj = f'{i}=value;'
                elif var[1] == "value":
                    obj = f'cookie={i};'
        elif cookie in taintsource and taintsource == yvalue:
            if dots in yvalue:
                var = x.split(dots)
                if var[1] == "name":
                    obj = f'{i}=value;'
                elif var[1] == "value":
                    obj = f'cookie={i};'
        
        script = f'document.cookie = {obj} + document.cookie'
        scripts.append(script) 
    driver = Chrome(service=Service(), options=option)
    source = 'cookies.get/cookies.getAll'
    url_of_injection_example = 'https://www.example.com'
    payload_file = 'small_payload.txt'

    try:
        # Navigate to example.com
        driver.get(url_of_injection_example)
        example = driver.current_window_handle

        # Wait up to 5 seconds for the title to become "Example Domain"
        title_condition = EC.title_is('Example Domain')
        WebDriverWait(driver, 5).until(title_condition)

        # get page source code of example.com
        example_source_code = driver.page_source

        # get extension popup.html
        driver.switch_to.new_window('tab')
        driver.get(url_path)
        extension = driver.current_window_handle

        # get page source code of extension
        extension_source_code = driver.page_source

        for script in scripts:
            # cookie case scenario will start from injecting script into example.com
            driver.switch_to.window(example)
            try:
                driver.execute_script(script)

                # get time of injection
                time_of_injection = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S,%f")
            except Exception as e:
                print(' !!!! PAYLOAD FAILLED !!!!')
                print('Error: ', str(e))
                continue

            # check for alerts in example
            try:
                # wait 2 seconds to see if alert is detected
                WebDriverWait(driver, 2).until(EC.alert_is_present())
                alert = driver.switch_to.alert
                alert.accept()
                print('[example] + Alert Detected +')
                # get time of success [1) example]
                time_of_success = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S,%f")
                payload_logging("SUCCESS", source, ext_id, 'h1-replacer(v3)', url_of_injection_example, 'normal', payload, time_of_injection, time_of_success, payload_file, 'nil')
            
            except TimeoutException:
                print('[example] = No alerts detected =')
                payload_logging("FAILURE", source, ext_id, 'h1-replacer(v3)', url_of_injection_example, 'normal', payload, time_of_injection, 'nil', payload_file, 'nil')

            driver.switch_to.window(extension)
            driver.refresh()
            driver.switch_to.window(example)

            # check for alerts in example again
            try:
                # wait 2 seconds to see if alert is detected
                WebDriverWait(driver, 2).until(EC.alert_is_present())
                alert = driver.switch_to.alert
                alert.accept()
                print('[example] + Alert Detected +')

                # get time of success [3) example]
                time_of_success = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S,%f")
                payload_logging("SUCCESS", source, ext_id, 'h1-replacer(v3)', url_of_injection_example, 'normal', payload, time_of_injection, time_of_success, payload_file, 'nil')
            except TimeoutException:
                print('[example] = No alerts detected =')
                payload_logging("FAILURE", source, ext_id, 'h1-replacer(v3)', url_of_injection_example, 'normal', payload, time_of_injection, 'nil', payload_file, 'nil')

            try: 
                # check modifications for example.com
                driver.switch_to.window(example)
                if example_source_code != driver.page_source:
                    driver.get("https://www.example.com")
                    print("Navigated back to 'https://www.example.com' due to page source changes")
            except:
                driver.refresh()

            try: 
                # check modifications for extension
                driver.switch_to.window(extension)
                if extension_source_code != driver.page_source:
                    driver.get(url_path)
                    print(f"Navigated back to '{url_path}' due to extension page source changes")
            except:
                driver.refresh()

    except TimeoutException:
        # Handle TimeoutException when title condition is not met
        print("Timeout: Title was not resolved to 'Example Domain'")

    except Exception as e:
        # Handle any other exceptions that occur
        print("An error occurred:", str(e))

# 4) location.hash
def location_hash(option, ext_id, url_path, payload, result):
    scripts = []
    for i in payload:
        script = f"window.location.hash = {i}"
        scripts.append(script)
    driver = Chrome(service=Service(), options=option)
    source = 'location.hash'
    url_of_injection_example = 'https://www.example.com'
    payload_file = 'small_payload.txt'

    try:
        # Navigate to example.com
        driver.get(url_of_injection_example)
        example = driver.current_window_handle

        # Wait up to 5 seconds for the title to become "Example Domain"
        title_condition = EC.title_is('Example Domain')
        WebDriverWait(driver, 5).until(title_condition)

        # get page source code of example.com
        example_source_code = driver.page_source

        # get extension popup.html
        driver.switch_to.new_window('tab')
        driver.get(url_path)
        extension = driver.current_window_handle

        # get page source code of extension
        extension_source_code = driver.page_source

        for script in scripts:
            # location.hash case scenario will start from injecting script into example.com
            driver.switch_to.window(example)
            try:
                driver.execute_script(script)

                # get time of injection
                time_of_injection = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S,%f")
            except Exception as e:
                print(' !!!! PAYLOAD FAILLED !!!!')
                print('Error: ', str(e))
                continue

            # check for alerts in example
            try:
                # wait 2 seconds to see if alert is detected
                WebDriverWait(driver, 2).until(EC.alert_is_present())
                alert = driver.switch_to.alert
                alert.accept()
                print('[example] + Alert Detected +')
                # get time of success [1) example]
                time_of_success = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S,%f")
                payload_logging("SUCCESS", source, ext_id, 'h1-replacer(v3)', url_of_injection_example, 'normal', payload, time_of_injection, time_of_success, payload_file, 'nil')
            
            except TimeoutException:
                print('[example] = No alerts detected =')
                payload_logging("FAILURE", source, ext_id, 'h1-replacer(v3)', url_of_injection_example, 'normal', payload, time_of_injection, 'nil', payload_file, 'nil')

            driver.switch_to.window(extension)
            driver.refresh()
            driver.switch_to.window(example)

            # check for alerts in example again
            try:
                # wait 2 seconds to see if alert is detected
                WebDriverWait(driver, 2).until(EC.alert_is_present())
                alert = driver.switch_to.alert
                alert.accept()
                print('[example] + Alert Detected +')

                # get time of success [3) example]
                time_of_success = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S,%f")
                payload_logging("SUCCESS", source, ext_id, 'h1-replacer(v3)', url_of_injection_example, 'normal', payload, time_of_injection, time_of_success, payload_file, 'nil')
            except TimeoutException:
                print('[example] = No alerts detected =')
                payload_logging("FAILURE", source, ext_id, 'h1-replacer(v3)', url_of_injection_example, 'normal', payload, time_of_injection, 'nil', payload_file, 'nil')

            try: 
                # check modifications for example.com
                driver.switch_to.window(example)
                if example_source_code != driver.page_source:
                    driver.get("https://www.example.com")
                    print("Navigated back to 'https://www.example.com' due to page source changes")
            except:
                driver.refresh()

            try: 
                # check modifications for extension
                driver.switch_to.window(extension)
                if extension_source_code != driver.page_source:
                    driver.get(url_path)
                    print(f"Navigated back to '{url_path}' due to extension page source changes")
            except:
                driver.refresh()

    except TimeoutException:
        # Handle TimeoutException when title condition is not met
        print("Timeout: Title was not resolved to 'Example Domain'")

    except Exception as e:
        # Handle any other exceptions that occur
        print("An error occurred:", str(e))

# 5) runtime.onMessageExternal
def runtime_onME(option, ext_id, url_path, payload, result):
    scripts = []
    for i in payload:
        dots = '.'
        taintsink = result["sink"]
        obj = ""
        if dots in taintsink:
            obj = nomagic(taintsink,i)
            script = f"chrome.runtime.sendMessage('{ext_id}',{obj})"
        else:
            obj = i
            script = f"chrome.runtime.sendMessage('{ext_id}','{obj}')"
        scripts.append(script)
    driver = Chrome(service=Service(), options=option)

# 6) runtime.onConnectExternal
def runtime_onCE(option, ext_id, url_path, payload, result):
    scripts = []
    for i in payload:
        dots = '.'
        taintsink = result["sink"]
        taintsource = result["source"]
        obj = {}
        var = ""
        func = ""
        connect = ""
        try:
            if result["metavars"]["PORT"]:
                port = result["metavars"]["PORT"]
        except:
            port = ""
        try:
            if result["metavars"]["PORTPROPERTY"]:
                portproperty = result["metavars"]["PORTPROPERTY"]
        except:
            portproperty = ""
        try:
            if result["metavars"]["PORTPASSWORD"]:
                portpassword = result["metavars"]["PORTPASSWORD"]
        except:
            portpassword = ""
        if dots in taintsink:
            obj = nomagic(taintsink,i)
        else:
            obj = i

        if port!="" and portproperty!="" and portpassword!="":
            connect = {portproperty:portpassword}
            connect = json.dumps(connect)

        var = f"obj = JSON.parse('{obj}');"
        func = f".postMessage(obj)"

        script = f"{var}chrome.runtime.connect({connect}){func}"
        print(script)
        scripts.append(script)
    driver = Chrome(service=Service(), options=option)

# 7) Window.name (works)
def window_name_new(driver, ext_id, url_path, payloads, result):

    source = 'window.name'
    url_of_injection_example = 'https://www.example.com'
    payload_file = 'small_payload.txt'

    try:
        # Navigate to example.com
        driver.get('https://www.example.com')
        example = driver.current_window_handle

        # Wait up to 5 seconds for the title to become "Example Domain"
        title_condition = EC.title_is('Example Domain')
        WebDriverWait(driver, 5).until(title_condition)

        # get page source code of example.com
        example_source_code = driver.page_source

        # get extension popup.html
        driver.switch_to.new_window('tab')
        driver.get(url_path)
        extension = driver.current_window_handle

        # get page source code of extension
        extension_source_code = driver.page_source


        for payload in payloads:
            print(payload)
            # since window.name is obtained from the website url, we will inject javascript to change the window.name
            driver.switch_to.window(example)

            try:
                driver.execute_script(f'window.name = `{payload}`;')

                # get time of injection
                time_of_injection = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S,%f")
            except Exception as e:
                print(' !!!! PAYLOAD FAILLED !!!!')
                print('Error: ', str(e))
                continue

            # check for alerts in example
            try:
                # wait 2 seconds to see if alert is detected
                WebDriverWait(driver, 2).until(EC.alert_is_present())
                alert = driver.switch_to.alert
                alert.accept()
                print('[example] + Alert Detected +')

                # get time of success [1) example]
                time_of_success = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S,%f")
                payload_logging("SUCCESS", source, ext_id, 'h1-replacer(v3)', url_of_injection_example, 'normal', payload, time_of_injection, time_of_success, payload_file, 'nil')
            
            except TimeoutException:
                print('[example] = No alerts detected =')
                payload_logging("FAILURE", source, ext_id, 'h1-replacer(v3)', url_of_injection_example, 'normal', payload, time_of_injection, 'nil', payload_file, 'nil')

                

            driver.switch_to.window(extension)
            driver.refresh()



            # check for alerts in extensions
            try:
                # wait 2 seconds to see if alert is detected
                WebDriverWait(driver, 2).until(EC.alert_is_present())
                alert = driver.switch_to.alert
                alert.accept()

                print('[extension] + Alert Detected +')

                # get time of success [2) extension]
                time_of_success = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S,%f")
                payload_logging("SUCCESS", source, ext_id, 'h1-replacer(v3)', url_of_injection_extension, 'normal', payload, time_of_injection, time_of_success, payload_file, 'nil')

            except TimeoutException:
                print('[extension] = No alerts detected =')
                payload_logging("FAILURE", source, ext_id, 'h1-replacer(v3)', url_of_injection_extension, 'normal', payload, time_of_injection, 'nil', payload_file, 'nil')


            driver.switch_to.window(example)

            # check for alerts in example
            try:
                # wait 2 seconds to see if alert is detected
                WebDriverWait(driver, 2).until(EC.alert_is_present())
                alert = driver.switch_to.alert
                alert.accept()
                print('[example] + Alert Detected +')

                # get time of success [3) example]
                time_of_success = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S,%f")
                payload_logging("SUCCESS", source, ext_id, 'h1-replacer(v3)', url_of_injection_example, 'normal', payload, time_of_injection, time_of_success, payload_file, 'nil')
            except TimeoutException:
                print('[example] = No alerts detected =')

                payload_logging("FAILURE", source, ext_id, 'h1-replacer(v3)', url_of_injection_example, 'normal', payload, time_of_injection, 'nil', payload_file, 'nil')


            try: 
                # check modifications for example.com
                driver.switch_to.window(example)
                if example_source_code != driver.page_source:
                    driver.get("https://www.example.com")
                    print("Navigated back to 'https://www.example.com' due to page source changes")

            except:
                print('error')

            try: 
                # check modifications for extension
                driver.switch_to.window(extension)
                if extension_source_code != driver.page_source:
                    driver.get(url_path)
                    print(f"Navigated back to '{url_path}' due to extension page source changes")

            except:
                print('error')

    except TimeoutException:
        # Handle TimeoutException when title condition is not met
        print("Timeout: Title was not resolved to 'Example Domain'")

    except Exception as e:
        # Handle any other exceptions that occur
        print("An error occurred:", str(e))

# 8) location.href (works)
def location_href_new(driver, ext_id, url_path, payloads, result):
    print('location.href')
    try:
        # Navigate to example.com
        driver.get('https://www.example.com')
        # set handler for example.com
        example = driver.current_window_handle

        # Wait up to 5 seconds for the title to become "Example Domain"
        title_condition = EC.title_is('Example Domain')
        WebDriverWait(driver, 5).until(title_condition)

        # get page source code of example.com
        example_source_code = driver.page_source

        # get extension popup.html
        driver.switch_to.new_window('tab')
        extension = driver.current_window_handle
        driver.get(url_path)

        # get page source code of extension
        extension_source_code = driver.page_source
    
        # we can inject a script to change the location.href variable using query parameters or fragment Idenfiers
        for j in range(2):
            for payload in payloads:
                print(payload)
                driver.switch_to.window(extension)
                driver.refresh()
                driver.switch_to.window(example)

                if j == 0:
                    try:
                        driver.execute_script(f"location.href = `https://www.example.com/?p={payload}`")
                    except Exception as e:
                        print(' !!!! PAYLOAD FAILLED !!!!')
                        print('Error: ', str(e))
                        continue
                        
                else:
                    try:
                        driver.execute_script(f"location.href = `https://www.example.com/#{payload}`")
                    except Exception as e:
                        print(' !!!! PAYLOAD FAILLED !!!!')
                        print('Error: ', str(e))
                        continue

                # observe behavior after payload injection

                driver.save_screenshot('DYNAMIC_ANALYSIS_v2/ss.png')
                # 1) Check for alerts in example
                try:
                    # wait 2 seconds to see if alert is detected
                    WebDriverWait(driver, 2).until(EC.alert_is_present())
                    alert = driver.switch_to.alert
                    alert.accept()
                    print('[example] + Alert Detected +')
                except TimeoutException:
                    print('[example] = No alerts detected =')

                # 2) Check for alerts in extensions
                driver.switch_to.window(extension)
                try:
                    # wait 2 seconds to see if alert is detected
                    WebDriverWait(driver, 2).until(EC.alert_is_present())
                    alert = driver.switch_to.alert
                    alert.accept()
                    print('[extension] + Alert Detected +')
                except TimeoutException:
                    print('[extension] = No alerts detected =')

                # 3) Check for alerts in example after refreshing extension
                driver.refresh()
                driver.switch_to.window(example)

                try:
                    # wait 2 seconds to see if alert is detected
                    WebDriverWait(driver, 2).until(EC.alert_is_present())
                    alert = driver.switch_to.alert
                    alert.accept()
                    print('[example] + Alert Detected +')
                except TimeoutException:
                    print('[example] = No alerts detected =')


                try: 
                    # check modifications for example.com
                    driver.switch_to.window(example)
                    if example_source_code != driver.page_source:
                        driver.get("https://www.example.com")
                        print("Navigated back to 'https://www.example.com' due to page source changes")

                except:
                    print('error')


                try: 
                    # check modifications for extension
                    driver.switch_to.window(extension)
                    if extension_source_code != driver.page_source:
                        driver.get(url_path)
                        print(f"Navigated back to '{url_path}' due to extension page source changes")

                except:
                    print('error')

    except TimeoutException:
        # Handle TimeoutException when title condition is not met
        print("Timeout: Title was not resolved to 'Example Domain'")

    except Exception as e:
        # Handle any other exceptions that occur
        print("An error occurred:", str(e))

# 9) Context_menu (to be removed)
def context_menu(driver, ext_id, url_path, payloads, result):
    from pynput.keyboard import Controller, Key
    import urllib.parse
    # entry points:
    # 1) Selection Text
    # 2) Link Url 
    # 3) Src Url
    # 4) frame Url
    # 5) Page Url

    # Selection Text 
    def context_menu_selectionText_new():
        website = "file:///home/showloser/dynamic/miscellaneous/xss_website.html"
        
        try:
            # get test xss website
            driver.get(website)
            # set handler for example.com
            example = driver.current_window_handle

            # Wait up to 5 seconds for the title to become "Xss Website"
            title_condition = EC.title_is('Xss Website')
            WebDriverWait(driver, 5).until(title_condition)

            # get page source code of example.com
            example_source_code = driver.page_source

            # get extension popup.html
            driver.switch_to.new_window('tab')
            extension = driver.current_window_handle
            driver.get(url_path)

            # get page source code of extension
            extension_source_code = driver.page_source


            for payload in payloads:
                
                # change to example tab
                driver.switch_to.window(example)

                try:
                    # using javascript, change the value of selectionText of predefined web element
                    driver.execute_script(f'document.getElementById("h1_element").innerText = `{payload}`')
                except Exception as e:
                    print(' !!!! PAYLOAD FAILLED !!!!')
                    print('Error: ', str(e))
                    continue

                # find h1_element to begin using extension
                target_element = driver.find_element(By.ID, 'h1_element')

                try:
                    # Select the text using JavaScript
                    driver.execute_script("window.getSelection().selectAllChildren(arguments[0]);", target_element)
                except Exception as e:
                    print(' !!!! Error Selecting Text !!!!')
                    print('Error: ', str(e))
                    continue

                
                # usage of context menu
                try:
                    # perform right click to open context menu
                    actions = ActionChains(driver)
                    actions.context_click(target_element).perform()

                    # navigate to extension context menu option
                    keyboard = Controller()
                    for _ in range(6):  
                        # Press the arrow key down
                        keyboard.press(Key.down)
                        # Release the arrow key
                        keyboard.release(Key.down)

                    # Press the Enter key
                    keyboard.press(Key.enter)
                    # Release the Enter key
                    keyboard.release(Key.enter)

                except Exception as e:
                    print(' !!!! Error using Context Menu !!!!')
                    print('Error: ', str(e))
                    continue

                
                # observe behavior after payload injection
                # 1) Check for alerts in example.com
                driver.switch_to.window(example)
                try:
                    # wait 2 seconds to see if alert is detected
                    WebDriverWait(driver, 2).until(EC.alert_is_present())
                    alert = driver.switch_to.alert
                    alert.accept()
                    print('+ Alert Detected +')
                except TimeoutException:
                    print('= No alerts detected =')
                        
                # 2) Check for alerts in extension
                driver.switch_to.window(extension)
                try:
                    # wait 2 seconds to see if alert is detected
                    WebDriverWait(driver, 2).until(EC.alert_is_present())
                    alert = driver.switch_to.alert
                    alert.accept()
                    print('[extension] + Alert Detected +')
                except TimeoutException:
                    print('[extension] = No alerts detected =')
                    
                # 3) Check for alerts in example after refreshing extension
                driver.refresh()
                driver.switch_to.window(example)
                try:
                    # wait 2 seconds to see if alert is detected
                    WebDriverWait(driver, 2).until(EC.alert_is_present())
                    alert = driver.switch_to.alert
                    alert.accept()
                    print('[example] + Alert Detected +')
                except TimeoutException:
                    print('[example] = No alerts detected =')


                # check for any modifications (snapshot back to original)
                try: 
                    # [1] check modifications for example.com
                    driver.switch_to.window(example)
                    if example_source_code != driver.page_source:
                        driver.get(website)
                        print(f"Navigated back to '{website}' due to page source changes")

                except:
                    print('error')


                try: 
                    # [2] check modifications for extension
                    driver.switch_to.window(extension)
                    if extension_source_code != driver.page_source:
                        driver.get(url_path)
                        print(f"Navigated back to '{url_path}' due to extension page source changes")

                except:
                    print('error')

        except TimeoutException:
            # Handle TimeoutException when title condition is not met
            print("Timeout: Title was not resolved to 'Example Domain'")

        except Exception as e:
            # Handle any other exceptions that occur
            print("An error occurred:", str(e))

    # Selection Text [Headless]
    def context_menu_selectionText_headless():
        import subprocess

        try:
            # website = "file:///home/showloser/dynamic/miscellaneous/xss_website.html"
            website = "file:///home/showloser/scanext/DYNAMIC_ANALYSIS_v2/miscellaneous/xss_website.html"

            # get www.example.com
            driver.get(website)
            driver.save_screenshot('DYNAMIC_ANALYSIS_v2/ss.png')

            # set handler for example.com
            example = driver.current_window_handle

            # Wait up to 5 seconds for the title to become "Xss Website"
            title_condition = EC.title_is('Xss Website')
            WebDriverWait(driver, 5).until(title_condition)

            # get page source code of example.com
            example_source_code = driver.page_source

            # get extension popup.html
            driver.switch_to.new_window('tab')
            extension = driver.current_window_handle
            driver.get(url_path)
            # get page source code of extension
            extension_source_code = driver.page_source


            for payload in payloads:
                print(payload)

                driver.switch_to.window(example)

                try:
                    driver.execute_script(f'document.getElementById("h1_element").innerText = `{payload}`')

                    # get time of injection
                    time_of_injection = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S,%f")

                except Exception as e:
                    print(' !!!! PAYLOAD FAILLED !!!!')
                    print('Error: ', str(e))
                    continue


                target_element = driver.find_element(By.ID, 'h1_element')

                try:
                    # Select the text using JavaScript
                    driver.execute_script("window.getSelection().selectAllChildren(arguments[0]);", target_element)
                except Exception as e:
                    print(' !!!! Error Selecting Text !!!!')
                    print('Error: ', str(e))
                    continue


                # usage of context menu
                try:
                    actions = ActionChains(driver)
                    actions.context_click(target_element).perform()


                    driver.save_screenshot('DYNAMIC_ANALYSIS_v2/ss.png')
                    time.sleep(2)


                    for _ in range(6):
                        subprocess.call(['xdotool', 'key', 'Down'])

                    # Simulate pressing the "Enter" key
                    subprocess.call(['xdotool', 'key', 'Return'])

                except Exception as e:
                    print(' !!!! Error using Context Menu !!!!')
                    print('Error: ', str(e))
                    continue


                # observe behavior after payload injection
                # 1) Check for alerts in example.com
                try:
                    # wait 2 seconds to see if alert is detected
                    WebDriverWait(driver, 2).until(EC.alert_is_present())
                    alert = driver.switch_to.alert
                    alert.accept()
                    print('[example] + Alert Detected +')

                    # get time of success [1) example]
                    time_of_success = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S,%f")
                
                except TimeoutException:
                    print('[example] = No alerts detected =')


                # 2) Check for alerts in extension
                driver.switch_to.window(extension)

                driver.save_screenshot('DYNAMIC_ANALYSIS_v2/ss.png')

                try:
                    # wait 2 seconds to see if alert is detected
                    WebDriverWait(driver, 2).until(EC.alert_is_present())
                    alert = driver.switch_to.alert
                    alert.accept()
                    print('[extension] + Alert Detected +')
                except TimeoutException:
                    print('[extension] = No alerts detected =')
                    
                # 3) Check for alerts in example after refreshing extension
                driver.refresh()
                driver.switch_to.window(example)

                driver.save_screenshot('DYNAMIC_ANALYSIS_v2/ss.png')


                try:
                    # wait 2 seconds to see if alert is detected
                    WebDriverWait(driver, 2).until(EC.alert_is_present())
                    alert = driver.switch_to.alert
                    alert.accept()
                    print('[example] + Alert Detected +')
                except TimeoutException:
                    print('[example] = No alerts detected =')


                # check for any modifications (snapshot back to original)
                try: 
                    # [1] check modifications for example.com
                    driver.switch_to.window(example)
                    if example_source_code != driver.page_source:
                        driver.get(website)
                        print(f"Navigated back to '{website}' due to page source changes")

                except:
                    print('error')


                try: 
                    # [2] check modifications for extension
                    driver.switch_to.window(extension)
                    if extension_source_code != driver.page_source:
                        driver.get(url_path)
                        print(f"Navigated back to '{url_path}' due to extension page source changes")

                except:
                    print('error')

        except TimeoutException:
            # Handle TimeoutException when title condition is not met
            print("Timeout: Title was not resolved to 'Example Domain'")

        except Exception as e:
            # Handle any other exceptions that occur
            print("An error occurred:", str(e))


    # Link Url     
    def context_menu_link_url_new():

        website = "file:///home/showloser/dynamic/miscellaneous/xss_website.html"

        try:
            # get test xss website
            driver.get(website)
            # set handler for example.com
            example = driver.current_window_handle

            # Wait up to 5 seconds for the title to become "Xss Website"
            title_condition = EC.title_is('Xss Website')
            WebDriverWait(driver, 5).until(title_condition)

            # get page source code of example.com
            example_source_code = driver.page_source

            # get extension popup.html
            driver.switch_to.new_window('tab')
            extension = driver.current_window_handle
            driver.get(url_path)

            # get page source code of extension
            extension_source_code = driver.page_source

            cases = ['queryParams', 'fragementIdentifier']


            for payload in payloads:

                # there are 2 possible ways to insert paylaod, either directly or using query parameters.
                for i in range(len(cases)):
                    # for link url, inject our payload into the link.
                    driver.switch_to.window(example)

                    # using selenium to find element by ID
                    target_element = driver.find_element(By.ID, 'linkUrl')

                    # Payload Injection (Href)
                    if i == 0:
                        try:
                            # PAYLOAD INJECTION CASE 1 (Directly Injecting)
                            print('Directly Injecting')
                            driver.execute_script(f'var linkElement = document.getElementById("linkUrl"); linkElement.href = `{payload}`')
                        except Exception as e:
                            print(' !!!! PAYLOAD FAILLED !!!!')
                            print('Error: ', str(e))
                            continue
                    elif i == 1:
                        try:
                            print('query params')
                            # PAYLOAD INJECTION CASE 2 (Injecting Query Parameters)
                            driver.execute_script(f'var linkElement = document.getElementById("linkUrl"); linkElement.href = "?q=`{payload}`"')
                        except Exception as e:
                            print(' !!!! PAYLOAD FAILLED !!!!')
                            print('Error: ', str(e))
                            continue
                    else:
                        print('ERROR') # lol this shd nvr happen

                    
                    # Seleting Text using javascript
                    try:
                        # perform text highlight/selection
                        driver.execute_script("window.getSelection().selectAllChildren(arguments[0]);", target_element)


                        # usage of context menu
                        try:
                            # perform right click to open context menu
                            actions = ActionChains(driver)
                            actions.context_click(target_element).perform()

                            # navigate to extension context menu option
                            keyboard = Controller()
                            for _ in range(11):  
                                # Press the arrow key down
                                keyboard.press(Key.down)
                                # Release the arrow key
                                keyboard.release(Key.down)

                            # Press the Enter key
                            keyboard.press(Key.enter)
                            # Release the Enter key
                            keyboard.release(Key.enter)

                        except Exception as e:
                            print(' !!!! Error using Context Menu !!!!')
                            print('Error: ', str(e))
                            continue

                    except Exception as e:
                        print(' !!!! Error Selecting Text !!!!')
                        print('Error: ', str(e))
                        continue
                
                    # observe behavior after payload injection
                    # 1) Check for alerts in example.com
                    driver.switch_to.window(example)
                    try:
                        # wait 2 seconds to see if alert is detected
                        WebDriverWait(driver, 2).until(EC.alert_is_present())
                        alert = driver.switch_to.alert
                        alert.accept()
                        print('+ Alert Detected +')
                    except TimeoutException:
                        print('= No alerts detected =')
                    

                    # 2) Check for alerts in extension
                    driver.switch_to.window(extension)
                    try:
                        # wait 2 seconds to see if alert is detected
                        WebDriverWait(driver, 2).until(EC.alert_is_present())
                        alert = driver.switch_to.alert
                        alert.accept()
                        print('[extension] + Alert Detected +')
                    except TimeoutException:
                        print('[extension] = No alerts detected =')


                    # 3) Check for alerts in example after refreshing extension
                    driver.refresh()
                    driver.switch_to.window(example)
                    try:
                        # wait 2 seconds to see if alert is detected
                        WebDriverWait(driver, 2).until(EC.alert_is_present())
                        alert = driver.switch_to.alert
                        alert.accept()
                        print('[example] + Alert Detected +')
                    except TimeoutException:
                        print('[example] = No alerts detected =')

                    # check for any modifications (snapshot back to original)
                    try: 
                        # [1] check modifications for example.com
                        driver.switch_to.window(example)
                        if example_source_code != driver.page_source:
                            driver.get(website)
                            print(f"Navigated back to '{website}' due to page source changes")

                    except Exception as e:
                        print('Error: ', str(e))


                    try: 
                        # [2] check modifications for extension
                        driver.switch_to.window(extension)
                        if extension_source_code != driver.page_source:
                            driver.get(url_path)
                            print(f"Navigated back to '{url_path}' due to extension page source changes")

                    except Exception as e:
                        print('Error: ', str(e))

        except TimeoutException:
            # Handle TimeoutException when title condition is not met
            print("Timeout: Title was not resolved to 'Example Domain'")

        except Exception as e:
            # Handle any other exceptions that occur
            print("An error occurred:", str(e))

    # Src Url [GUI]
    def context_menu_src_url():
        # get www.example.com
        driver.get('file:////home/showloser/localhost/dynamic/test.html')
        # set handler for example.com
        example = driver.current_window_handle

        # get extension popup.html
        driver.switch_to.new_window('tab')
        extension = driver.current_window_handle
        driver.get(url_path)
    

        for payload in payloads:

            driver.switch_to.window(example)
            target_element = driver.find_element(By.ID, 'srcUrl')
            # driver.execute_script("var range = document.createRange(); range.selectNode(arguments[0]); console.log(range);window.getSelection().addRange(range);", target_element)

            driver.execute_script(f"document.getElementById('srcUrl').src = `{payload}`")

            # # perform right click to open context menu
            actions = ActionChains(driver)

            actions.drag_and_drop_by_offset(actions.move_to_element_with_offset(target_element,50,0).release().perform(), -80,0).context_click().perform()

            # navigate to extension context menu option
            time.sleep(1)
            keyboard = Controller()
            for _ in range(7):  
                # Press the arrow key down
                keyboard.press(Key.down)
                # Release the arrow key
                keyboard.release(Key.down)

            # Press the Enter key
            keyboard.press(Key.enter)
            # Release the Enter key
            keyboard.release(Key.enter)
            
            try:
                # wait 2 seconds to see if alert is detected
                WebDriverWait(driver, 2).until(EC.alert_is_present())
                alert = driver.switch_to.alert
                alert.accept()
                print('+ Alert Detected +')
            except TimeoutException:
                print('= No alerts detected =')
            
            driver.switch_to.window(extension)
            time.sleep(2)

    # Frame Url 
    def context_menu_frame_url_new():
        
        website = "file:///home/showloser/dynamic/miscellaneous/xss_website.html"

        try:
            # get test xss website
            driver.get(website)
            # set handler for example.com
            example = driver.current_window_handle

            # Wait up to 5 seconds for the title to become "Xss Website"
            title_condition = EC.title_is('Xss Website')
            WebDriverWait(driver, 5).until(title_condition)

            # get page source code of example.com
            example_source_code = driver.page_source

            # get extension popup.html
            driver.switch_to.new_window('tab')
            extension = driver.current_window_handle
            driver.get(url_path)

            # get page source code of extension
            extension_source_code = driver.page_source

            cases = ['queryParams', 'fragementIdentifier']

            for payload in payloads:
                for i in range(len(cases)):
                    driver.switch_to.window(example)

                    # using selenium to find element by ID
                    iframeElement = driver.find_element(By.ID, 'frameUrl')

                    if i == 0:
                        try:
                            print('QueryParams')
                            driver.execute_script(f'var frameElement = document.getElementById("frameUrl"); frameElement.src = `https://www.example_xss.com/XSS?q={payload}`')
                        except Exception as e:
                            print(' !!!! PAYLOAD FAILLED !!!!')
                            print('Error: ', str(e))
                            continue
                    elif i == 1:
                        try:
                            print('RragmentIdentifier')
                            driver.execute_script(f'var frameElement = document.getElementById("frameUrl"); frameElement.src = `https://www.example_xss.com/XSS#{payload}`')
                        except Exception as e:
                            print(' !!!! PAYLOAD FAILLED !!!!')
                            print('Error: ', str(e))
                            continue
                    else:
                        print('ERROR')

                    # usage of context menu
                    try:
                        # # perform right click to open context menu
                        actions = ActionChains(driver)
                        actions.move_to_element(iframeElement)
                        actions.context_click().perform()

                        # navigate to extension context menu option
                        keyboard = Controller()
                        for _ in range(8):  
                            # Press the arrow key down
                            keyboard.press(Key.down)
                            # Release the arrow key
                            keyboard.release(Key.down)

                        # Press the Enter key
                        keyboard.press(Key.enter)
                        # Release the Enter key
                        keyboard.release(Key.enter)

                    except Exception as e:
                        print(' !!!! Error using Context Menu !!!!')
                        print('Error: ', str(e))
                        continue

                    
                    # observe behavior after payload injection
                    # 1) Check for alerts in example.com
                    driver.switch_to.window(example)
                    try:
                        # wait 2 seconds to see if alert is detected
                        WebDriverWait(driver, 2).until(EC.alert_is_present())
                        alert = driver.switch_to.alert
                        alert.accept()
                        print('+ Alert Detected +')
                    except TimeoutException:
                        print('= No alerts detected =')

                    # 2) Check for alerts in extension
                    driver.switch_to.window(extension)
                    try:
                        # wait 2 seconds to see if alert is detected
                        WebDriverWait(driver, 2).until(EC.alert_is_present())
                        alert = driver.switch_to.alert
                        alert.accept()
                        print('[extension] + Alert Detected +')
                    except TimeoutException:
                        print('[extension] = No alerts detected =')

                    # 3) Check for alerts in example after refreshing extension
                    driver.refresh()
                    driver.switch_to.window(example)
                    try:
                        # wait 2 seconds to see if alert is detected
                        WebDriverWait(driver, 2).until(EC.alert_is_present())
                        alert = driver.switch_to.alert
                        alert.accept()
                        print('[example] + Alert Detected +')
                    except TimeoutException:
                        print('[example] = No alerts detected =')


                    # check for any modifications (snapshot back to original)
                    try: 
                        # [1] check modifications for example.com
                        driver.switch_to.window(example)
                        if example_source_code != driver.page_source:
                            driver.get(website)
                            print(f"Navigated back to '{website}' due to page source changes")

                    except Exception as e:
                        print('Error: ', str(e))


                    try: 
                        # [2] check modifications for extension
                        driver.switch_to.window(extension)
                        if extension_source_code != driver.page_source:
                            driver.get(url_path)
                            print(f"Navigated back to '{url_path}' due to extension page source changes")

                    except Exception as e:
                        print('Error: ', str(e))

        except TimeoutException:
            # Handle TimeoutException when title condition is not met
            print("Timeout: Title was not resolved to 'Example Domain'")

        except Exception as e:
            # Handle any other exceptions that occur
            print("An error occurred:", str(e))

    # PageUrl 
    def context_menu_page_url_new():
        website = "file:///home/showloser/dynamic/miscellaneous/xss_website.html"
        
        # Maximum wait time of 5 seconds
        wait = WebDriverWait(driver,5)

        try:
            # get test xss website
            driver.get(website)
            # set handler for example.com
            example = driver.current_window_handle

            # Wait up to 5 seconds for the title to become "Xss Website"
            title_condition = EC.title_is('Xss Website')
            WebDriverWait(driver, 5).until(title_condition)

            # get page source code of example.com
            example_source_code = driver.page_source

            # get extension popup.html
            driver.switch_to.new_window('tab')
            extension = driver.current_window_handle
            driver.get(url_path)

            # get page source code of extension
            extension_source_code = driver.page_source

            cases = ['queryParams', 'fragementIdentifier']

            for payload in payloads:
                for i in range(len(cases)):
                    driver.switch_to.window(example)

                    # url encode xss payload 
                    encoded_payload = urllib.parse.quote(payload)


                    if i == 0:
                        try:    
                            print('QueryParams')
                            driver.execute_script(f"window.history.replaceState(null, null, `{website}?qureyParam={encoded_payload}`)")
                        except Exception as e:
                            print(' !!!! PAYLOAD FAILLED !!!!')
                            print('Error: ', str(e))
                            continue
                    elif i == 1:
                        try:
                            print('FragmentIdentifier')
                            driver.execute_script(f"window.history.replaceState(null, null, `{website}#{encoded_payload}`)")
                        except Exception as e:
                            print(' !!!! PAYLOAD FAILLED !!!!')
                            print('Error: ', str(e))
                            continue
                    else:
                        print("ERROR")

                    PageUrlElement = wait.until(EC.presence_of_element_located((By.ID, 'pageUrl')))

                    # usage of context menu
                    try:
                        # # perform right click to open context menu
                        actions = ActionChains(driver)
                        actions.move_to_element(PageUrlElement)
                        actions.context_click().perform()


                        # navigate to extension context menu option
                        keyboard = Controller()
                        for _ in range(8):  
                            # Press the arrow key down
                            keyboard.press(Key.down)
                            # Release the arrow key
                            keyboard.release(Key.down)

                        # Press the Enter key
                        keyboard.press(Key.enter)
                        # Release the Enter key
                        keyboard.release(Key.enter)

                    except Exception as e:
                        print(' !!!! Error using Context Menu !!!!')
                        print('Error: ', str(e))
                        continue


                    # observe behavior after payload injection
                    # 1) Check for alerts in example.com
                    driver.switch_to.window(example)
                    try:
                        # wait 2 seconds to see if alert is detected
                        WebDriverWait(driver, 2).until(EC.alert_is_present())
                        alert = driver.switch_to.alert
                        alert.accept()
                        print('+ Alert Detected +')
                    except TimeoutException:
                        print('= No alerts detected =')

                    # 2) Check for alerts in extension
                    driver.switch_to.window(extension)
                    try:
                        # wait 2 seconds to see if alert is detected
                        WebDriverWait(driver, 2).until(EC.alert_is_present())
                        alert = driver.switch_to.alert
                        alert.accept()
                        print('[extension] + Alert Detected +')
                    except TimeoutException:
                        print('[extension] = No alerts detected =')

                    # 3) Check for alerts in example after refreshing extension
                    driver.refresh()
                    driver.switch_to.window(example)
                    try:
                        # wait 2 seconds to see if alert is detected
                        WebDriverWait(driver, 2).until(EC.alert_is_present())
                        alert = driver.switch_to.alert
                        alert.accept()
                        print('[example] + Alert Detected +')
                    except TimeoutException:
                        print('[example] = No alerts detected =')

                    # check for any modifications (snapshot back to original)
                    try: 
                        # [1] check modifications for example.com
                        driver.switch_to.window(example)
                        if example_source_code != driver.page_source:
                            driver.get(website)
                            print(f"Navigated back to '{website}' due to page source changes")

                    except Exception as e:
                        print('Error: ', str(e))

                    try: 
                        # [2] check modifications for extension
                        driver.switch_to.window(extension)
                        if extension_source_code != driver.page_source:
                            driver.get(url_path)
                            print(f"Navigated back to '{url_path}' due to extension page source changes")

                    except Exception as e:
                        print('Error: ', str(e))


        except TimeoutException:
            # Handle TimeoutException when title condition is not met
            print("Timeout: Title was not resolved to 'Example Domain'")

        except Exception as e:
            # Handle any other exceptions that occur
            print("An error occurred:", str(e))
 
    context_menu_selectionText_headless()

# 9.1) Context_menu_selectionText (works)
def context_menu_selectionText(driver, ext_id, url_path, payloads, result):
    import subprocess

    try:
        # website = "file:///home/showloser/dynamic/miscellaneous/xss_website.html"
        website = "file:///home/showloser/scanext/DYNAMIC_ANALYSIS_v2/miscellaneous/xss_website.html"

        # get www.example.com
        driver.get(website)
        driver.save_screenshot('DYNAMIC_ANALYSIS_v2/ss.png')

        # set handler for example.com
        example = driver.current_window_handle

        # Wait up to 5 seconds for the title to become "Xss Website"
        title_condition = EC.title_is('Xss Website')
        WebDriverWait(driver, 5).until(title_condition)

        # get page source code of example.com
        example_source_code = driver.page_source

        # get extension popup.html
        driver.switch_to.new_window('tab')
        extension = driver.current_window_handle
        driver.get(url_path)
        # get page source code of extension
        extension_source_code = driver.page_source


        for payload in payloads:
            print(payload)

            driver.switch_to.window(example)

            try:
                driver.execute_script(f'document.getElementById("h1_element").innerText = `{payload}`')

                # get time of injection
                time_of_injection = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S,%f")

            except Exception as e:
                print(' !!!! PAYLOAD FAILLED !!!!')
                print('Error: ', str(e))
                continue


            target_element = driver.find_element(By.ID, 'h1_element')

            try:
                # Select the text using JavaScript
                driver.execute_script("window.getSelection().selectAllChildren(arguments[0]);", target_element)
            except Exception as e:
                print(' !!!! Error Selecting Text !!!!')
                print('Error: ', str(e))
                continue


            # usage of context menu
            try:
                actions = ActionChains(driver)
                actions.context_click(target_element).perform()


                driver.save_screenshot('DYNAMIC_ANALYSIS_v2/ss.png')
                time.sleep(2)


                for _ in range(6):
                    subprocess.call(['xdotool', 'key', 'Down'])

                # Simulate pressing the "Enter" key
                subprocess.call(['xdotool', 'key', 'Return'])

            except Exception as e:
                print(' !!!! Error using Context Menu !!!!')
                print('Error: ', str(e))
                continue


            # observe behavior after payload injection
            # 1) Check for alerts in example.com
            try:
                # wait 2 seconds to see if alert is detected
                WebDriverWait(driver, 2).until(EC.alert_is_present())
                alert = driver.switch_to.alert
                alert.accept()
                print('[example] + Alert Detected +')

                # get time of success [1) example]
                time_of_success = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S,%f")
            
            except TimeoutException:
                print('[example] = No alerts detected =')


            # 2) Check for alerts in extension
            driver.switch_to.window(extension)

            driver.save_screenshot('DYNAMIC_ANALYSIS_v2/ss.png')

            try:
                # wait 2 seconds to see if alert is detected
                WebDriverWait(driver, 2).until(EC.alert_is_present())
                alert = driver.switch_to.alert
                alert.accept()
                print('[extension] + Alert Detected +')
            except TimeoutException:
                print('[extension] = No alerts detected =')
                
            # 3) Check for alerts in example after refreshing extension
            driver.refresh()
            driver.switch_to.window(example)

            driver.save_screenshot('DYNAMIC_ANALYSIS_v2/ss.png')


            try:
                # wait 2 seconds to see if alert is detected
                WebDriverWait(driver, 2).until(EC.alert_is_present())
                alert = driver.switch_to.alert
                alert.accept()
                print('[example] + Alert Detected +')
            except TimeoutException:
                print('[example] = No alerts detected =')


            # check for any modifications (snapshot back to original)
            try: 
                # [1] check modifications for example.com
                driver.switch_to.window(example)
                if example_source_code != driver.page_source:
                    driver.get(website)
                    print(f"Navigated back to '{website}' due to page source changes")

            except:
                print('error')


            try: 
                # [2] check modifications for extension
                driver.switch_to.window(extension)
                if extension_source_code != driver.page_source:
                    driver.get(url_path)
                    print(f"Navigated back to '{url_path}' due to extension page source changes")

            except:
                print('error')

    except TimeoutException:
        # Handle TimeoutException when title condition is not met
        print("Timeout: Title was not resolved to 'Example Domain'")

    except Exception as e:
        # Handle any other exceptions that occur
        print("An error occurred:", str(e))

# 9.2) Context_menu_link_Url (works)
def context_menu_link_url(driver, ext_id, url_path, payloads, result):
    import subprocess

    website = "file:///home/showloser/dynamic/miscellaneous/xss_website.html"

    try:
        # get test xss website
        driver.get(website)
        # set handler for example.com
        example = driver.current_window_handle

        # Wait up to 5 seconds for the title to become "Xss Website"
        title_condition = EC.title_is('Xss Website')
        WebDriverWait(driver, 5).until(title_condition)

        # get page source code of example.com
        example_source_code = driver.page_source

        # get extension popup.html
        driver.switch_to.new_window('tab')
        extension = driver.current_window_handle
        driver.get(url_path)

        # get page source code of extension
        extension_source_code = driver.page_source

        cases = ['queryParams', 'fragementIdentifier']


        for payload in payloads:

            # there are 2 possible ways to insert paylaod, either directly or using query parameters.
            for i in range(len(cases)):
                # for link url, inject our payload into the link.
                driver.switch_to.window(example)

                # using selenium to find element by ID
                target_element = driver.find_element(By.ID, 'linkUrl')

                # Payload Injection (Href)
                if i == 0:
                    try:
                        # PAYLOAD INJECTION CASE 1 (Directly Injecting)
                        print('Directly Injecting')
                        driver.execute_script(f'var linkElement = document.getElementById("linkUrl"); linkElement.href = `{payload}`')
                    except Exception as e:
                        print(' !!!! PAYLOAD FAILLED !!!!')
                        print('Error: ', str(e))
                        continue
                elif i == 1:
                    try:
                        print('query params')
                        # PAYLOAD INJECTION CASE 2 (Injecting Query Parameters)
                        driver.execute_script('var linkElement = document.getElementById("linkUrl"); linkElement.href = "?q=" + `{}`'.format(payload.replace('"', '\\"').replace("'", "\\'")))

                    except Exception as e:
                        print(' !!!! PAYLOAD FAILLED !!!!')
                        print('Error: ', str(e))
                        continue
                else:
                    print('ERROR') # lol this shd nvr happen

                
                # Seleting Text using javascript
                try:
                    # perform text highlight/selection
                    driver.execute_script("window.getSelection().selectAllChildren(arguments[0]);", target_element)


                    # usage of context menu
                    try:
                        # perform right click to open context menu
                        actions = ActionChains(driver)
                        actions.context_click(target_element).perform()

                        # navigate to extension context menu option
                        for _ in range(11):
                            subprocess.call(['xdotool', 'key', 'Down'])

                        # Simulate pressing the "Enter" key
                        subprocess.call(['xdotool', 'key', 'Return'])

                    except Exception as e:
                        print(' !!!! Error using Context Menu !!!!')
                        print('Error: ', str(e))
                        continue

                except Exception as e:
                    print(' !!!! Error Selecting Text !!!!')
                    print('Error: ', str(e))
                    continue
            
                # observe behavior after payload injection
                # 1) Check for alerts in example.com
                driver.switch_to.window(example)
                driver.save_screenshot('DYNAMIC_ANALYSIS_v2/ss.png')

                try:
                    # wait 2 seconds to see if alert is detected
                    WebDriverWait(driver, 2).until(EC.alert_is_present())
                    alert = driver.switch_to.alert
                    alert.accept()
                    print('+ Alert Detected +')
                except TimeoutException:
                    print('= No alerts detected =')
                

                # 2) Check for alerts in extension
                driver.switch_to.window(extension)
                driver.save_screenshot('DYNAMIC_ANALYSIS_v2/ss.png')
                try:
                    # wait 2 seconds to see if alert is detected
                    WebDriverWait(driver, 2).until(EC.alert_is_present())
                    alert = driver.switch_to.alert
                    alert.accept()
                    print('[extension] + Alert Detected +')
                except TimeoutException:
                    print('[extension] = No alerts detected =')


                # 3) Check for alerts in example after refreshing extension
                driver.refresh()
                driver.switch_to.window(example)
                driver.save_screenshot('DYNAMIC_ANALYSIS_v2/ss.png')
                try:
                    # wait 2 seconds to see if alert is detected
                    WebDriverWait(driver, 2).until(EC.alert_is_present())
                    alert = driver.switch_to.alert
                    alert.accept()
                    print('[example] + Alert Detected +')
                except TimeoutException:
                    print('[example] = No alerts detected =')

                # check for any modifications (snapshot back to original)
                try: 
                    # [1] check modifications for example.com
                    driver.switch_to.window(example)
                    if example_source_code != driver.page_source:
                        driver.get(website)
                        print(f"Navigated back to '{website}' due to page source changes")

                except Exception as e:
                    print('Error: ', str(e))


                try: 
                    # [2] check modifications for extension
                    driver.switch_to.window(extension)
                    if extension_source_code != driver.page_source:
                        driver.get(url_path)
                        print(f"Navigated back to '{url_path}' due to extension page source changes")

                except Exception as e:
                    print('Error: ', str(e))

    except TimeoutException:
        # Handle TimeoutException when title condition is not met
        print("Timeout: Title was not resolved to 'Example Domain'")

    except Exception as e:
        # Handle any other exceptions that occur
        print("An error occurred:", str(e))

# 9.3) Context_menu_Src_Url (error)
def context_menu_src_url(driver, ext_id, url_path, payloads, result):
    from pynput.keyboard import Controller, Key

    # get www.example.com
    driver.get('file:////home/showloser/localhost/dynamic/test.html')
    # set handler for example.com
    example = driver.current_window_handle

    # get extension popup.html
    driver.switch_to.new_window('tab')
    extension = driver.current_window_handle
    driver.get(url_path)


    for payload in payloads:

        driver.switch_to.window(example)
        target_element = driver.find_element(By.ID, 'srcUrl')
        # driver.execute_script("var range = document.createRange(); range.selectNode(arguments[0]); console.log(range);window.getSelection().addRange(range);", target_element)

        driver.execute_script(f"document.getElementById('srcUrl').src = `{payload}`")

        # # perform right click to open context menu
        actions = ActionChains(driver)

        actions.drag_and_drop_by_offset(actions.move_to_element_with_offset(target_element,50,0).release().perform(), -80,0).context_click().perform()

        # navigate to extension context menu option
        time.sleep(1)
        keyboard = Controller()
        for _ in range(7):  
            # Press the arrow key down
            keyboard.press(Key.down)
            # Release the arrow key
            keyboard.release(Key.down)

        # Press the Enter key
        keyboard.press(Key.enter)
        # Release the Enter key
        keyboard.release(Key.enter)
        
        try:
            # wait 2 seconds to see if alert is detected
            WebDriverWait(driver, 2).until(EC.alert_is_present())
            alert = driver.switch_to.alert
            alert.accept()
            print('+ Alert Detected +')
        except TimeoutException:
            print('= No alerts detected =')
        
        driver.switch_to.window(extension)
        time.sleep(2)

# 9.4) Context_menu_frame_Url (works)
def context_menu_frame_url(driver, ext_id, url_path, payloads, result):
    import subprocess

    try:

        website = "file:///home/showloser/dynamic/miscellaneous/xss_website.html"

        # get test xss website
        driver.get(website)
        # set handler for example.com
        example = driver.current_window_handle

        # Wait up to 5 seconds for the title to become "Xss Website"
        title_condition = EC.title_is('Xss Website')
        WebDriverWait(driver, 5).until(title_condition)

        # get page source code of example.com
        example_source_code = driver.page_source

        # get extension popup.html
        driver.switch_to.new_window('tab')
        extension = driver.current_window_handle
        driver.get(url_path)

        # get page source code of extension
        extension_source_code = driver.page_source

        cases = ['queryParams', 'fragementIdentifier']

        for payload in payloads:
            for i in range(len(cases)):
                driver.switch_to.window(example)

                # using selenium to find element by ID
                iframeElement = driver.find_element(By.ID, 'frameUrl')

                if i == 0:
                    try:
                        print('QueryParams')
                        driver.execute_script(f'var frameElement = document.getElementById("frameUrl"); frameElement.src = `https://www.example_xss.com/XSS?q={payload}`')
                    except Exception as e:
                        print(' !!!! PAYLOAD FAILLED !!!!')
                        print('Error: ', str(e))
                        continue
                elif i == 1:
                    try:
                        print('RragmentIdentifier')
                        driver.execute_script(f'var frameElement = document.getElementById("frameUrl"); frameElement.src = `https://www.example_xss.com/XSS#{payload}`')
                    except Exception as e:
                        print(' !!!! PAYLOAD FAILLED !!!!')
                        print('Error: ', str(e))
                        continue
                else:
                    print('ERROR')

                # usage of context menu
                try:
                    # # perform right click to open context menu
                    actions = ActionChains(driver)
                    actions.move_to_element(iframeElement)
                    actions.context_click().perform()

                    # navigate to extension context menu option


                    for _ in range(8):
                        subprocess.call(['xdotool', 'key', 'Down'])

                    # Simulate pressing the "Enter" key
                    subprocess.call(['xdotool', 'key', 'Return'])

                except Exception as e:
                    print(' !!!! Error using Context Menu !!!!')
                    print('Error: ', str(e))
                    continue

                
                # observe behavior after payload injection
                # 1) Check for alerts in example.com
                driver.switch_to.window(example)
                driver.save_screenshot('DYNAMIC_ANALYSIS_v2/ss.png')

                try:
                    # wait 2 seconds to see if alert is detected
                    WebDriverWait(driver, 2).until(EC.alert_is_present())
                    alert = driver.switch_to.alert
                    alert.accept()
                    print('+ Alert Detected +')
                except TimeoutException:
                    print('= No alerts detected =')

                # 2) Check for alerts in extension
                driver.switch_to.window(extension)
                driver.save_screenshot('DYNAMIC_ANALYSIS_v2/ss.png')

                try:
                    # wait 2 seconds to see if alert is detected
                    WebDriverWait(driver, 2).until(EC.alert_is_present())
                    alert = driver.switch_to.alert
                    alert.accept()
                    print('[extension] + Alert Detected +')
                except TimeoutException:
                    print('[extension] = No alerts detected =')

                # 3) Check for alerts in example after refreshing extension
                driver.refresh()
                driver.switch_to.window(example)
                driver.save_screenshot('DYNAMIC_ANALYSIS_v2/ss.png')

                try:
                    # wait 2 seconds to see if alert is detected
                    WebDriverWait(driver, 2).until(EC.alert_is_present())
                    alert = driver.switch_to.alert
                    alert.accept()
                    print('[example] + Alert Detected +')
                except TimeoutException:
                    print('[example] = No alerts detected =')


                # check for any modifications (snapshot back to original)
                try: 
                    # [1] check modifications for example.com
                    driver.switch_to.window(example)
                    if example_source_code != driver.page_source:
                        driver.get(website)
                        print(f"Navigated back to '{website}' due to page source changes")

                except Exception as e:
                    print('Error: ', str(e))


                try: 
                    # [2] check modifications for extension
                    driver.switch_to.window(extension)
                    if extension_source_code != driver.page_source:
                        driver.get(url_path)
                        print(f"Navigated back to '{url_path}' due to extension page source changes")

                except Exception as e:
                    print('Error: ', str(e))

    except TimeoutException:
        # Handle TimeoutException when title condition is not met
        print("Timeout: Title was not resolved to 'Example Domain'")

    except Exception as e:
        # Handle any other exceptions that occur
        print("An error occurred:", str(e))

# 9.5) Context_menu_PageUrl (works)
def context_menu_pageUrl(driver, ext_id, url_path, payloads, result):
    import urllib.parse
    import subprocess

    website = "file:///home/showloser/dynamic/miscellaneous/xss_website.html"
    
    # Maximum wait time of 5 seconds
    wait = WebDriverWait(driver,5)

    try:
        # get test xss website
        driver.get(website)
        # set handler for example.com
        example = driver.current_window_handle

        # Wait up to 5 seconds for the title to become "Xss Website"
        title_condition = EC.title_is('Xss Website')
        WebDriverWait(driver, 5).until(title_condition)

        # get page source code of example.com
        example_source_code = driver.page_source

        # get extension popup.html
        driver.switch_to.new_window('tab')
        extension = driver.current_window_handle
        driver.get(url_path)

        # get page source code of extension
        extension_source_code = driver.page_source

        cases = ['queryParams', 'fragementIdentifier']

        for payload in payloads:
            for i in range(len(cases)):
                driver.switch_to.window(example)

                # url encode xss payload 
                encoded_payload = urllib.parse.quote(payload)


                if i == 0:
                    try:    
                        print('QueryParams')
                        driver.execute_script(f"window.history.replaceState(null, null, `{website}?qureyParam={encoded_payload}`)")
                    except Exception as e:
                        print(' !!!! PAYLOAD FAILLED !!!!')
                        print('Error: ', str(e))
                        continue
                elif i == 1:
                    try:
                        print('FragmentIdentifier')
                        driver.execute_script(f"window.history.replaceState(null, null, `{website}#{encoded_payload}`)")
                    except Exception as e:
                        print(' !!!! PAYLOAD FAILLED !!!!')
                        print('Error: ', str(e))
                        continue
                else:
                    print("ERROR")

                PageUrlElement = wait.until(EC.presence_of_element_located((By.ID, 'pageUrl')))

                # usage of context menu
                try:
                    # # perform right click to open context menu
                    actions = ActionChains(driver)
                    actions.move_to_element(PageUrlElement)
                    actions.context_click().perform()

                    for _ in range(8):
                        subprocess.call(['xdotool', 'key', 'Down'])

                    # Simulate pressing the "Enter" key
                    subprocess.call(['xdotool', 'key', 'Return'])

                except Exception as e:
                    print(' !!!! Error using Context Menu !!!!')
                    print('Error: ', str(e))
                    continue


                # observe behavior after payload injection
                # 1) Check for alerts in example.com
                driver.switch_to.window(example)
                driver.save_screenshot('DYNAMIC_ANALYSIS_v2/ss.png')
                try:
                    # wait 2 seconds to see if alert is detected
                    WebDriverWait(driver, 2).until(EC.alert_is_present())
                    alert = driver.switch_to.alert
                    alert.accept()
                    print('+ Alert Detected +')
                except TimeoutException:
                    print('= No alerts detected =')

                # 2) Check for alerts in extension
                driver.switch_to.window(extension)
                driver.save_screenshot('DYNAMIC_ANALYSIS_v2/ss.png')

                try:
                    # wait 2 seconds to see if alert is detected
                    WebDriverWait(driver, 2).until(EC.alert_is_present())
                    alert = driver.switch_to.alert
                    alert.accept()
                    print('[extension] + Alert Detected +')
                except TimeoutException:
                    print('[extension] = No alerts detected =')

                # 3) Check for alerts in example after refreshing extension
                driver.refresh()
                driver.switch_to.window(example)
                driver.save_screenshot('DYNAMIC_ANALYSIS_v2/ss.png')

                try:
                    # wait 2 seconds to see if alert is detected
                    WebDriverWait(driver, 2).until(EC.alert_is_present())
                    alert = driver.switch_to.alert
                    alert.accept()
                    print('[example] + Alert Detected +')
                except TimeoutException:
                    print('[example] = No alerts detected =')

                # check for any modifications (snapshot back to original)
                try: 
                    # [1] check modifications for example.com
                    driver.switch_to.window(example)
                    if example_source_code != driver.page_source:
                        driver.get(website)
                        print(f"Navigated back to '{website}' due to page source changes")

                except Exception as e:
                    print('Error: ', str(e))

                try: 
                    # [2] check modifications for extension
                    driver.switch_to.window(extension)
                    if extension_source_code != driver.page_source:
                        driver.get(url_path)
                        print(f"Navigated back to '{url_path}' due to extension page source changes")

                except Exception as e:
                    print('Error: ', str(e))


    except TimeoutException:
        # Handle TimeoutException when title condition is not met
        print("Timeout: Title was not resolved to 'Example Domain'")

    except Exception as e:
        # Handle any other exceptions that occur
        print("An error occurred:", str(e))
 

# 10) chromeTabsQuery
def chromeTabsQuery(driver,ext_id, url_path, payloads, result):
    properties = ['favIconUrl', 'sessionId', 'title', 'url']

    def chromeTabQuery_title():
        # Case Secnario for chromeTabQuery_Title

        # get www.example.com
        driver.get('https://www.example.com')
        # set handler for example.com
        example = driver.current_window_handle

        # get extension popup.html
        driver.switch_to.new_window('tab')
        extension = driver.current_window_handle
        driver.get(url_path)


        for payload in payloads:
            
            # change to example.com to change document.title property
            driver.switch_to.window(example)
            driver.refresh()
            driver.execute_script(f'document.title = `{payload}`;')

            # change to extension:
            driver.switch_to.window(extension)
            driver.refresh()

            driver.execute_script("document.getElementById('entryPoint').value = '2';")
            driver.execute_script("document.getElementById('submit').click();")

            driver.switch_to.window(example)
            try:
                # wait 5 seconds to see if alert is detected
                WebDriverWait(driver, 5).until(EC.alert_is_present())
                alert = driver.switch_to.alert
                alert.accept()
                print('+ Alert Detected +')
            except TimeoutException:
                print('= No alerts detected =')

    def chromeTabQuery_title_new():
        try:
            # get www.example.com
            driver.get('https://www.example.com')
            # set handler for example.com
            example = driver.current_window_handle

            # Wait up to 5 seconds for the title to become "Example Domain"
            title_condition = EC.title_is('Example Domain')
            WebDriverWait(driver, 5).until(title_condition)

            # get page source code of example.com
            example_source_code = driver.page_source

            # get extension popup.html
            driver.switch_to.new_window('tab')
            extension = driver.current_window_handle
            driver.get(url_path)

            # get page source code of extension
            extension_source_code = driver.page_source


            for payload in payloads:

                # change to example.com to change document.title property
                driver.switch_to.window(example)
                driver.refresh()

                try:
                    driver.execute_script(f'document.title = `{payload}`;')
                except Exception as e:
                    print(' !!!! PAYLOAD FAILLED !!!!')
                    print('Error: ', str(e))
                    continue

                

                # hardcode some interactions
                driver.switch_to.window(extension)
                driver.refresh()
                driver.execute_script("document.getElementById('entryPoint').value = '2';")
                driver.execute_script("document.getElementById('submit').click();")
                # hardcode some interactions



                # observe behavior after payload injection
                # 1) Check for alerts in example
                try:
                    # wait 2 seconds to see if alert is detected
                    WebDriverWait(driver, 2).until(EC.alert_is_present())
                    alert = driver.switch_to.alert
                    alert.accept()
                    print('[example] + Alert Detected +')
                except TimeoutException:
                    print('[example] = No alerts detected =')

                # 2) Check for alerts in extensions
                driver.switch_to.window(extension)
                try:
                    # wait 2 seconds to see if alert is detected
                    WebDriverWait(driver, 2).until(EC.alert_is_present())
                    alert = driver.switch_to.alert
                    alert.accept()
                    print('[extension] + Alert Detected +')
                except TimeoutException:
                    print('[extension] = No alerts detected =')

                
                # 3) Check for alerts in example after refreshing extension
                driver.refresh()
                driver.switch_to.window(example)

                try:
                    # wait 2 seconds to see if alert is detected
                    WebDriverWait(driver, 2).until(EC.alert_is_present())
                    alert = driver.switch_to.alert
                    alert.accept()
                    print('[example] + Alert Detected +')
                except TimeoutException:
                    print('[example] = No alerts detected =')


                try: 
                    # check modifications for example.com
                    driver.switch_to.window(example)
                    if example_source_code != driver.page_source:
                        driver.get("https://www.example.com")
                        print("Navigated back to 'https://www.example.com' due to page source changes")

                except:
                    print('error')


                try: 
                    # check modifications for extension
                    driver.switch_to.window(extension)
                    if extension_source_code != driver.page_source:
                        driver.get(url_path)
                        print(f"Navigated back to '{url_path}' due to extension page source changes")

                except:
                    print('error')



        except TimeoutException:
            # Handle TimeoutException when title condition is not met
            print("Timeout: Title was not resolved to 'Example Domain'")

        except Exception as e:
            # Handle any other exceptions that occur
            print("An error occurred:", str(e))

    def chromeTabQuery_url():
        # Case Secnario for chromeTabQuery_url

        # get www.example.com
        driver.get('https://www.example.com')
        # set handler for example.com
        example = driver.current_window_handle

        # get extension popup.html
        driver.switch_to.new_window('tab')
        extension = driver.current_window_handle
        driver.get(url_path)


        for payload in payloads:
            payload = payload.strip()
            
            # change to example.com to change url property
            driver.switch_to.window(example)
            # driver.execute_script(f"location.href = 'https://www.example.com/?p{payload}'")
            driver.execute_script(f"location.href = 'https://www.example.com/?p={payload}'")


            # change to extension:
            driver.switch_to.window(extension)
            driver.refresh()

            driver.execute_script("document.getElementById('entryPoint').value = '3';")
            driver.execute_script("document.getElementById('submit').click();")

            driver.switch_to.window(example)
            try:
                # wait 5 seconds to see if alert is detected
                WebDriverWait(driver, 5).until(EC.alert_is_present())
                alert = driver.switch_to.alert
                alert.accept()
                print('+ Alert Detected +')
            except TimeoutException:
                print('= No alerts detected =')

    def chromeTabQuery_url_new():
        # Case Secnario for chromeTabQuery_url_new
        try:

            # Navigate to example.com
            driver.get('https://www.example.com')
            # set handler for example.com
            example = driver.current_window_handle

            # Wait up to 5 seconds for the title to become "Example Domain"
            title_condition = EC.title_is('Example Domain')
            WebDriverWait(driver, 5).until(title_condition)

            # get page source code of example.com
            example_source_code = driver.page_source

            # get extension popup.html
            driver.switch_to.new_window('tab')
            extension = driver.current_window_handle
            driver.get(url_path)

            # get page source code of extension
            extension_source_code = driver.page_source


            for payload in payloads:
                payload = payload.strip()

                # change to example.com to change url property
                driver.switch_to.window(example)
                try:
                    driver.execute_script(f"location.href = `https://www.example.com/?p={payload}`")
                except Exception as e:
                    print(' !!!! PAYLOAD FAILLED !!!!')
                    print('Error: ', str(e))
                    continue



                # hardcode some interactions
                driver.switch_to.window(extension)
                driver.refresh()
                driver.execute_script("document.getElementById('entryPoint').value = '3';")
                driver.execute_script("document.getElementById('submit').click();")
                # hardcode some interactions



                # observe behavior after payload injection
                # 1) Check for alerts in example
                try:
                    # wait 2 seconds to see if alert is detected
                    WebDriverWait(driver, 2).until(EC.alert_is_present())
                    alert = driver.switch_to.alert
                    alert.accept()
                    print('[example] + Alert Detected +')
                except TimeoutException:
                    print('[example] = No alerts detected =')

                # 2) Check for alerts in extensions
                driver.switch_to.window(extension)
                try:
                    # wait 2 seconds to see if alert is detected
                    WebDriverWait(driver, 2).until(EC.alert_is_present())
                    alert = driver.switch_to.alert
                    alert.accept()
                    print('[extension] + Alert Detected +')
                except TimeoutException:
                    print('[extension] = No alerts detected =')

                
                # 3) Check for alerts in example after refreshing extension
                driver.refresh()
                driver.switch_to.window(example)

                try:
                    # wait 2 seconds to see if alert is detected
                    WebDriverWait(driver, 2).until(EC.alert_is_present())
                    alert = driver.switch_to.alert
                    alert.accept()
                    print('[example] + Alert Detected +')
                except TimeoutException:
                    print('[example] = No alerts detected =')


                try: 
                    # check modifications for example.com
                    driver.switch_to.window(example)
                    if example_source_code != driver.page_source:
                        driver.get("https://www.example.com")
                        print("Navigated back to 'https://www.example.com' due to page source changes")

                except:
                    print('error')


                try: 
                    # check modifications for extension
                    driver.switch_to.window(extension)
                    if extension_source_code != driver.page_source:
                        driver.get(url_path)
                        print(f"Navigated back to '{url_path}' due to extension page source changes")

                except:
                    print('error')


        except TimeoutException:
            # Handle TimeoutException when title condition is not met
            print("Timeout: Title was not resolved to 'Example Domain'")

        except Exception as e:
            # Handle any other exceptions that occur
            print("An error occurred:", str(e))


    def chromeTabQuery_favIconUrl():

        def payload_generation(payloads):
            favIconUrl_payloads = []

            def check_line(line):
                # ISSUE
                # ISSUE: because of url encoding, if our file has ', it might not be able to access it!
                # ISSUE
                # forbidden_chars = ['/', '\\', ':', '*', '?', '"', '<', '>', '|', "'"]
                forbidden_chars = ['/', '\\', ':', '*', '?', '"', '<', '>', '|']

                return all(char not in line for char in forbidden_chars)

            def find_lines_without_chars(filename):
                with open(filename, 'r') as file:
                    lines = file.readlines()
                    lines_without_chars = [line.rstrip('\n') for line in lines if check_line(line)]
                    return lines_without_chars

            filename = 'payloads/payloads.txt'
            lines_without_chars = find_lines_without_chars(filename)
            for line in lines_without_chars:
                favIconUrl_payloads.append(line)
            
            return favIconUrl_payloads

        favIconUrl_payloads = payload_generation(payloads)


        def rename_file_with_payloads(favIconUrl_payloads):

            folder_path = "miscellaneous/favIconUrl_payload"
            files = os.listdir(folder_path)
            if len(files) == 0:
                print("No files found in the test folder.")
                return
            elif len(files) > 1:
                print("Multiple files found in the test folder. Please ensure there is only one file.")
                return

            old_filename = os.path.join(folder_path, files[0])



            new_filename = os.path.join(folder_path, favIconUrl_payloads + ".jpg")
            os.rename(old_filename, new_filename)
            print(f"File renamed to: {new_filename}, ")
            old_filename = new_filename

        def changeFavIconUrl(driver, payload):
            # remove current favIconUrl
            driver.execute_script("""
            var linkElement = document.querySelector('link[rel="icon"]');
            if (linkElement) {
            linkElement.parentNode.removeChild(linkElement);
            }
            """)

            # set new favIconUrl
            driver.execute_script(f"""
            var link = document.createElement('link');
            link.type = 'image/jpg';
            link.rel = 'icon';
            link.href = 'favIconUrl_payload/{payload}.jpg';
            document.head.appendChild(link);
            """)


        # get www.example.com
        driver.get('file:///home/showloser/localhost/dynamic/miscellaneous/xss_website.html')
        # set handler for example.com
        example = driver.current_window_handle
        # add a default favIconUrl
        driver.execute_script("""
        var link = document.createElement('link');
        link.type = 'image/jpg';
        link.rel = 'icon';
        link.href = 'default.jpg';
        document.head.appendChild(link);
        """)

        # get extension popup.html
        driver.switch_to.new_window('tab')
        extension = driver.current_window_handle
        driver.get(url_path)



        for i in favIconUrl_payloads:
            time.sleep(1)
            driver.switch_to.window(example)

            # change filename to payloads
            rename_file_with_payloads(i)

            # use filename as payload in ext
            changeFavIconUrl(driver, i)

            try:
                # wait 2 seconds to see if alert is detected
                WebDriverWait(driver, 2).until(EC.alert_is_present())
                alert = driver.switch_to.alert
                alert.accept()
                print('[FALSE] Alert Detected [FALSE]')
            except TimeoutException:
                print('[FALSE] No alerts detected [FALSE]')

                
            driver.switch_to.window(extension)

            # use the extension
            driver.execute_script("document.getElementById('entryPoint').value = '0';")
            driver.execute_script("document.getElementById('submit').click();")

            driver.switch_to.window(example)
            try:
                # wait 2 seconds to see if alert is detected
                WebDriverWait(driver, 2).until(EC.alert_is_present())
                alert = driver.switch_to.alert
                alert.accept()
                print('+ Alert Detected +')
            except TimeoutException:
                print('= No alerts detected =')

    def chromeTabQuery_favIconUrl_new():

        def payload_generation(payloads):
            favIconUrl_payloads = []

            def check_line(line):
                # ISSUE
                # ISSUE: because of url encoding, if our file has ', it might not be able to access it!
                # ISSUE
                # forbidden_chars = ['/', '\\', ':', '*', '?', '"', '<', '>', '|', "'"]
                forbidden_chars = ['/', '\\', ':', '*', '?', '"', '<', '>', '|']

                return all(char not in line for char in forbidden_chars)

            def find_lines_without_chars(filename):
                with open(filename, 'r') as file:
                    lines = file.readlines()
                    lines_without_chars = [line.rstrip('\n') for line in lines if check_line(line)]
                    return lines_without_chars

            filename = 'payloads/payloads.txt'
            lines_without_chars = find_lines_without_chars(filename)
            for line in lines_without_chars:
                favIconUrl_payloads.append(line)
            
            return favIconUrl_payloads

        favIconUrl_payloads = payload_generation(payloads)

        def rename_file_with_payloads(favIconUrl_payloads):

            folder_path = "miscellaneous/favIconUrl_payload"
            files = os.listdir(folder_path)
            if len(files) == 0:
                print("No files found in the test folder.")
                return
            elif len(files) > 1:
                print("Multiple files found in the test folder. Please ensure there is only one file.")
                return

            old_filename = os.path.join(folder_path, files[0])



            new_filename = os.path.join(folder_path, favIconUrl_payloads + ".jpg")
            os.rename(old_filename, new_filename)
            print(f"File renamed to: {new_filename}, ")
            old_filename = new_filename

        def changeFavIconUrl(driver, payload):
            # remove current favIconUrl
            driver.execute_script("""
            var linkElement = document.querySelector('link[rel="icon"]');
            if (linkElement) {
            linkElement.parentNode.removeChild(linkElement);
            }
            """)

            # set new favIconUrl
            driver.execute_script(f"""
            var link = document.createElement('link');
            link.type = 'image/jpg';
            link.rel = 'icon';
            link.href = 'favIconUrl_payload/{payload}.jpg';
            document.head.appendChild(link);
            """)


# 10.1) chromeTabsQuery_title
def chromeTabsQuery_title(driver,ext_id, url_path, payloads, result):
    try:
        # get www.example.com
        driver.get('https://www.example.com')
        # set handler for example.com
        example = driver.current_window_handle

        # Wait up to 5 seconds for the title to become "Example Domain"
        title_condition = EC.title_is('Example Domain')
        WebDriverWait(driver, 5).until(title_condition)

        # get page source code of example.com
        example_source_code = driver.page_source

        # get extension popup.html
        driver.switch_to.new_window('tab')
        extension = driver.current_window_handle
        driver.get(url_path)

        # get page source code of extension
        extension_source_code = driver.page_source


        for payload in payloads:

            # change to example.com to change document.title property
            driver.switch_to.window(example)
            driver.refresh()

            try:
                driver.execute_script(f'document.title = `{payload}`;')
            except Exception as e:
                print(' !!!! PAYLOAD FAILLED !!!!')
                print('Error: ', str(e))
                continue

            

            # hardcode some interactions
            driver.switch_to.window(extension)
            driver.refresh()
            driver.execute_script("document.getElementById('entryPoint').value = '2';")
            driver.execute_script("document.getElementById('submit').click();")
            # hardcode some interactions



            # observe behavior after payload injection
            # 1) Check for alerts in example
            try:
                # wait 2 seconds to see if alert is detected
                WebDriverWait(driver, 2).until(EC.alert_is_present())
                alert = driver.switch_to.alert
                alert.accept()
                print('[example] + Alert Detected +')
            except TimeoutException:
                print('[example] = No alerts detected =')

            # 2) Check for alerts in extensions
            driver.switch_to.window(extension)
            try:
                # wait 2 seconds to see if alert is detected
                WebDriverWait(driver, 2).until(EC.alert_is_present())
                alert = driver.switch_to.alert
                alert.accept()
                print('[extension] + Alert Detected +')
            except TimeoutException:
                print('[extension] = No alerts detected =')

            
            # 3) Check for alerts in example after refreshing extension
            driver.refresh()
            driver.switch_to.window(example)

            try:
                # wait 2 seconds to see if alert is detected
                WebDriverWait(driver, 2).until(EC.alert_is_present())
                alert = driver.switch_to.alert
                alert.accept()
                print('[example] + Alert Detected +')
            except TimeoutException:
                print('[example] = No alerts detected =')


            try: 
                # check modifications for example.com
                driver.switch_to.window(example)
                if example_source_code != driver.page_source:
                    driver.get("https://www.example.com")
                    print("Navigated back to 'https://www.example.com' due to page source changes")

            except:
                print('error')


            try: 
                # check modifications for extension
                driver.switch_to.window(extension)
                if extension_source_code != driver.page_source:
                    driver.get(url_path)
                    print(f"Navigated back to '{url_path}' due to extension page source changes")

            except:
                print('error')



    except TimeoutException:
        # Handle TimeoutException when title condition is not met
        print("Timeout: Title was not resolved to 'Example Domain'")

    except Exception as e:
        # Handle any other exceptions that occur
        print("An error occurred:", str(e))


def chromeTabQuery_favIconUrl(driver,ext_id, url_path, payloads, result, pid):
    import shutil

    def create_directory(pid):
        directory_name = f'DYNAMIC_ANALYSIS_v2/miscellaneous/ChromeTabQueryFiles/favIconUrl_instance_{pid}'
        if not os.path.exists(directory_name):
            os.makedirs(directory_name)
            return True  # Directory was created
        else:
            print(f"Directory already exists: {directory_name}")
            return False  # Directory already existed
        
    def copy_picture_to_directory(picture_path, directory):
        shutil.copy2(picture_path, directory)

    def access_directory(pid):
        directory_name = f'DYNAMIC_ANALYSIS_v2/miscellaneous/ChromeTabQueryFiles/favIconUrl_instance_{pid}'
        picture_path = 'DYNAMIC_ANALYSIS_v2/miscellaneous/default.jpg'  # Specify the path of the picture you want to copy

        if create_directory(pid):
            if os.path.exists(picture_path):
                copy_picture_to_directory(picture_path, directory_name)
                print(f"Picture copied to directory: {directory_name}")
            else:
                print("Picture path doesn't exist!")

    def rename_file_with_payloads(pid,payload):
        directory_name = f'DYNAMIC_ANALYSIS_v2/miscellaneous/ChromeTabQueryFiles/favIconUrl_instance_{pid}'

        files = os.listdir(directory_name)
        if len(files) == 0:
            print("No files found in the test folder.")
            return
        elif len(files) > 1:
            print("Multiple files found in the test folder. Please ensure there is only one file.")
            return

        old_filename = os.path.join(directory_name, files[0])

        new_filename = os.path.join(directory_name, payload + ".jpg")
        os.rename(old_filename, new_filename)
        print(f"File renamed to: {new_filename}, ")
        old_filename = new_filename

    def changeFavIconUrl(driver, pid ,payload):
        # remove current favIconUrl
        driver.execute_script("""
        var linkElement = document.querySelector('link[rel="icon"]');
        if (linkElement) {
        linkElement.parentNode.removeChild(linkElement);
        }
        """)

        try:
            # set new favIconUrl
            driver.execute_script(f"""
            var link = document.createElement('link');
            link.type = 'image/jpg';
            link.rel = 'icon';
            link.href = '/ChromeTabQueryFiles/favIconUrl_instance_1/blaoejds222.jpg';
            document.head.appendChild(link);
            """)
        except Exception as e:
            print('fk error lah')
            print(str(e))


    print(payloads)

    # preconfigure files required
    # access_directory(pid)



    # get www.example.com
    driver.get('file:///home/showloser/scanext/DYNAMIC_ANALYSIS_v2/miscellaneous/xss_website.html')
    driver.save_screenshot('DYNAMIC_ANALYSIS_v2/ss.png')

    # set handler for example.com
    example = driver.current_window_handle
    # add a default favIconUrl
    driver.execute_script("""
    var link = document.createElement('link');
    link.type = 'image/jpg';
    link.rel = 'icon';
    link.href = 'default.jpg';
    document.head.appendChild(link);
    """)

    # get extension popup.html
    driver.switch_to.new_window('tab')
    extension = driver.current_window_handle
    driver.get(url_path)

    
    for payload in payloads:

        # forbidden_chars = ['/', '\\', ':', '*', '?', '"', '<', '>', '|', "'"]
        forbidden_chars = ['/', '\\', ':', '*', '?', '"', '<', '>', '|']
        # skip payloads that contain forbidden_chars
        if any(char in payload for char in forbidden_chars):
            continue

        driver.switch_to.window(example)

        # change filename to payloads
        rename_file_with_payloads(pid,payload)

        # use filename as payload in ext
        changeFavIconUrl(driver, pid, payload)


        try:
            # wait 2 seconds to see if alert is detected
            WebDriverWait(driver, 2).until(EC.alert_is_present())
            alert = driver.switch_to.alert
            alert.accept()
            print('[True] Alert Detected [True]')
        except TimeoutException:
            print('[FALSE] No alerts detected [FALSE]')

        driver.save_screenshot('DYNAMIC_ANALYSIS_v2/ss.png')

        driver.switch_to.window(extension)
        driver.save_screenshot('DYNAMIC_ANALYSIS_v2/ss.png')

        # hard coded interactions
        # hard coded interactions
        driver.execute_script("document.getElementById('entryPoint').value = '0';")
        driver.execute_script("document.getElementById('submit').click();")
        # hard coded interactions
        # hard coded interactions


        driver.switch_to.window(example)
        
        time.sleep(2)
        driver.save_screenshot('DYNAMIC_ANALYSIS_v2/ss.png')
        time.sleep(2)


        try:
            # wait 2 seconds to see if alert is detected
            WebDriverWait(driver, 2).until(EC.alert_is_present())
            alert = driver.switch_to.alert
            alert.accept()
            print('+ Alert Detected +')
        except TimeoutException:
            print('= No alerts detected =')





# 11) locationSearch
def locationSearch(driver, ext_id, url_path, payloads, result):

    # get www.example.com
    driver.get('https://www.example.com')
    # set handler for example.com
    example = driver.current_window_handle

    # get extension popup.html
    driver.switch_to.new_window('tab')
    extension = driver.current_window_handle
    driver.get(url_path)

    for payload in payloads:

        # define a query parameter
        driver.switch_to.window(example)
        driver.execute_script(f'window.location.search=`?q={payload}`')

        driver.switch_to.window(extension)
        driver.refresh()
        driver.switch_to.window(example)


        try:
            # wait 2 seconds to see if alert is detected
            WebDriverWait(driver, 2).until(EC.alert_is_present())
            alert = driver.switch_to.alert
            alert.accept()
            print('+ Alert Detected +')
        except TimeoutException:
            print('= No alerts detected =')

# 12) window.addEventLister.msg
def windowAddEventListenerMessage(driver, ext_id, url_path, payloads, result):
    # PAYLOAD: 
    # postMessage({ message: "<img src=x onerror=alert(1)>" }, "*")
    
    # get xss test website
    driver.get('file:////home/showloser/localhost/dynamic/test.html')
    # set handler for example.com
    example = driver.current_window_handle

    # get extension popup.html
    driver.switch_to.new_window('tab')
    extension = driver.current_window_handle
    driver.get(url_path)

    # pre-configure
    buttons = driver.find_elements(By.TAG_NAME,"button")
    for button in buttons:
        button.click()

    # implement tommorow 

    regex_results = ['data', 'log', 'cocksuker123', '123skd', 'message']
    # regex_results = []

    xss_payload = '<img src=x onerror=alert(1)>'

    driver.switch_to.window(example)

    # check if regex scan found anything
    # if regex able to find scan results, send payload as json object
    if len(regex_results) > 0:
        object_payload = {key: xss_payload for key in regex_results}
        driver.execute_script(f"window.postMessage({object_payload},'*')")

        try:
            # wait 2 seconds to see if alert is detected
            WebDriverWait(driver, 2).until(EC.alert_is_present())
            alert = driver.switch_to.alert
            alert.accept()
            print('+ Alert Detected +')
        except TimeoutException:
            print('= No alerts detected =')

    # else, send payload as string
    else:
        driver.execute_script(f"window.postMessage(`{xss_payload}`,'*')")

        try:
            # wait 2 seconds to see if alert is detected
            WebDriverWait(driver, 2).until(EC.alert_is_present())
            alert = driver.switch_to.alert
            alert.accept()
            print('+ Alert Detected +')
        except TimeoutException:
            print('= No alerts detected =')




# to test)
# 1)chrome_tab_query_title
# 2)chromeTabQuery_url_new
# 3)chromeTabQuery_favIconUrl_new
# DID NOT IMPLEMENT SESSION ID(becuz idk how)