import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
from os import path
import hashlib
import logging
from multiprocessing import Pool, cpu_count
from selenium.common.exceptions import NoAlertPresentException


from tqdm import tqdm
from selenium.webdriver import Chrome
from selenium.webdriver.chrome.service import Service

from concurrent.futures import ThreadPoolExecutor, ProcessPoolExecutor
from threading import Event
from itertools import cycle


def logs(driver, alert, result, extension_name, payload):
    # !! [Selenium cant take screenshot of alerts as it occurs outside the DOM] !!
    # driver.save_screenshot("alert_screenshot.png")
    try:
        # Log the info (both success and fail)
        if result == "Success":
            alert_text = alert.text
            alert.accept()  # Accept the alert window
            logging.critical(
                f"{time.strftime('%Y-%m-%d %H:%M:%S')}, {result}, {logging.getLevelName(logging.CRITICAL)}, {extension_name}, {alert_text}, {payload}"
            )
        else:
            logging.error(
                f"{time.strftime('%Y-%m-%d %H:%M:%S')}, {result}, {logging.getLevelName(logging.INFO)}, {extension_name}, 'NIL', {payload}"
            )
    except NoAlertPresentException:
        logging.warning("No alert present")
    except Exception as e:
        logging.error(f"An error occurred: {str(e)}")


# def process_payload(items, payloads,url_path, abs_path):


def process_wrapper(args_tuple):
    event, process, order, opt, payloads, url_path = args_tuple
    # process, order, opt, payloads, url_path = args_tuple
    return process(event, opt, order, payloads, url_path)


def process_payload(event, options, order, payloads, url_path):
    global progress_bars
    # payloads = payload_gen(order)
    driver = Chrome(service=Service(), options=options)
    driver.get(url_path)
    original = driver.current_window_handle
    driver.switch_to.new_window("tab")
    new = driver.current_window_handle

    driver.get("https://www.example.com")
    driver.switch_to.window(original)

    for payload in payloads:
        if event.is_set():
            a = driver.find_element(By.ID, "replacementInput")
            a.clear()
            a.send_keys(payload)
            button = driver.find_element(By.ID, "replaceButton")
            button.click()

            driver.switch_to.window(new)
            # raise NameError # TO-DO how to handle error from a process?
            try:
                # wait 3 seconds to see if alert is detected
                WebDriverWait(driver, 2).until(EC.alert_is_present())
                alert = driver.switch_to.alert
                # logs(driver, alert, "Success", url_path, payload) # this bloody function fks it up, maybe use logging module directly

                logging.critical(
                    f"{time.strftime('%Y-%m-%d %H:%M:%S')}, Success, {logging.getLevelName(logging.CRITICAL)}, {url_path}, {alert.text}, {payload}"
                )
                # print('+ Alert Detected +')
            except TimeoutException:
                logging.error(
                    f"{time.strftime('%Y-%m-%d %H:%M:%S')}, Failure, {logging.getLevelName(logging.INFO)}, {url_path}, 'NIL', {payload}"
                )
                # logs(driver, "NIL", "Fail", url_path, payload) # this bloody function fks it up, maybe use logging module directly
                # print('= No alerts detected =')

            # change back to popup.html to try another payload
            driver.switch_to.window(original)

            # update progress bar
            progress_bars[order].update(1)


def gui(extension_path: str, payload_file_path: str, n: int):
    thread_count = cpu_count()
    if n > thread_count:
        print("Warning, number of instances requested > number of threads of CPU.")
        print("Not advisable to do so.")
        print("Exiting ... ")
        exit()
    if n == thread_count:
        print("Warning, number of instances requested == number of threads of CPU.")
        print("If user wishes to perform other tasks on the system,")
        print(
            "then the recommended max number of instances = number of threads CPU - 1"
        )
        print("Continuing ... ")

    # Getting id of extension [start]
    def get_ext_id(path_to_extension):
        abs_path = path.abspath(path_to_extension)
        m = hashlib.sha256()
        m.update(abs_path.encode("utf-8"))
        ext_id = "".join([chr(int(i, base=16) + 97) for i in m.hexdigest()][:32])
        url_path = f"chrome-extension://{ext_id}/popup.html"
        return url_path, abs_path

    url_path, abs_path = get_ext_id(extension_path)

    options = webdriver.ChromeOptions()
    # options.add_experimental_option("detach", True)
    load_ext_arg = "load-extension=" + abs_path
    options.add_argument(load_ext_arg)
    options.add_argument("--enable-logging")

    def payloads_cycle(n: int, file_path: str):
        c = cycle(range(n))
        payloads = [[] for _ in range(n)]
        with open(file_path, "r") as file:
            for line in file:
                if line != "\n":
                    payloads[c.__next__()].append(line.rstrip())
        return [len(p) for p in payloads], tuple(tuple(s) for s in payloads)

    totals, payloads = payloads_cycle(n, payload_file_path)

    global progress_bars
    progress_bars = [
        tqdm(
            total=totals[order],
            desc=f"Instance {order}",
            bar_format="{desc}: {bar} {percentage:3.0f}%|{n_fmt}/{total_fmt} [{elapsed}<{remaining}, {rate_fmt}{postfix}]",
        )
        for order in range(n)
    ]

    # args = [
    #     (process_payload, order, options, payloads[order], url_path)
    #     for order in range(n)
    # ]

    event = Event()
    event.set()
    args = [
        (event, process_payload, order, options, payloads[order], url_path)
        for order in range(n)
    ]

    # ================ #

    # loading bar issue, when all finish loading bar freaks out
    # slightly faster

    # with Pool(n) as pool:
    #     for _ in pool.imap(process_wrapper, args):
    #         pass

    # ==== #

    # ^C DOES NOT KILL THREADS NEED Event() SHIT LIKE SPINNER
    # NO loading bar issue
    # slightly slower

    with ThreadPoolExecutor(n) as executor:
        for _ in executor.map(process_wrapper, args):
            try:
                pass
            except KeyboardInterrupt:
                event.clear()
    
    # ================ #


def main():
    # Configure logging
    logging.basicConfig(
        filename="DYNAMIC_ANALYSIS/dynamic/logs/penetration_log_gui.txt",
        level=logging.ERROR,
        format="%(asctime)s, %(message)s",
    )

    # Run program
    gui(
        "DYNAMIC_ANALYSIS/wm_donttouch/Extensions/h1-replacer/h1-replacer_P",
        "DYNAMIC_ANALYSIS/dynamic/payloads/payloads.txt",
        3,
    )


if __name__ == "__main__":
    main()
