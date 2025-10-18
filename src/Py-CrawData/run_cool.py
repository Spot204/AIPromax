# run_cool.py
import subprocess, sys, threading, time, os
try:
    from pyfiglet import Figlet
    from colorama import init, Fore, Style
except Exception:
    print("Thiếu thư viện. Cài bằng: pip install pyfiglet colorama")
    sys.exit(1)

init(autoreset=True)

def banner(text):
    f = Figlet(font="slant")
    print(Fore.CYAN + f.renderText(text))

def spinner(proc):
    chars = "|/-\\"
    i = 0
    while proc.poll() is None:
        print(Fore.YELLOW + "\r[" + chars[i % len(chars)] + "] Đang chạy... " + time.strftime("%H:%M:%S"), end="")
        time.sleep(0.15)
        i += 1
    print()

def main():
    # Tùy chỉnh chữ banner ở đây
    banner("BLACK - DATA ")
    print(Fore.GREEN + "Chạy: CrawData.py" + Style.DIM)
    print(Fore.MAGENTA + "Start at:", time.strftime("%Y-%m-%d %H:%M:%S"))
    # đổi title console (Windows)
    try:
        if os.name == "nt":
            os.system('title AIPROMAX - Crawling Mode')
    except:
        pass

    cmd = [sys.executable, r"C:\Code\vscode\html\AIPromax\src\Py-CrawData\CrawData.py"]
    # proc = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True)
    proc = subprocess.Popen(
    cmd,
    stdout=subprocess.PIPE,
    stderr=subprocess.STDOUT,
    text=True,
    encoding='utf-8',      # 👈 thêm dòng này
    errors='replace'       # 👈 và dòng này để bỏ ký tự lỗi nếu có
)


    # spinner thread
    t = threading.Thread(target=spinner, args=(proc,), daemon=True)
    t.start()

    # forward output realtime
    for line in proc.stdout:
        # bạn có thể filter hoặc màu hóa theo nội dung
        print(Fore.WHITE + line, end="")

    ret = proc.wait()
    if ret == 0:
        print(Fore.GREEN + "\n✓ Hoàn thành lúc " + time.strftime("%H:%M:%S"))
    else:
        print(Fore.RED + f"\n✗ Kết thúc với code {ret}")

if __name__ == "__main__":
    main()
