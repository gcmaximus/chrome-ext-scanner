import subprocess

print("start of program")

# Config rules
rules = "STATIC_ANALYSIS/semgrep_rules/1-window_name/1a-innerHTML.yaml"

# Codes to be scanned
filename = "STATIC_ANALYSIS/test_codes/semgrep_test.js"
# filename = "h1-replacer(v3)"
# filename = "emailextractor"

# Output file
output_file = "STATIC_ANALYSIS/semgrep_results.json"


# auto semgrep scan
def run_semgrep():
    command = [
        "semgrep",
        "scan",
        f"--config={rules}",
        filename,
        "--output",
        output_file,
        "--json",
        "--quiet",  # turn off verbose
    ]
    try:
        subprocess.run(command, check=True)
        print("Semgrep scan successful.")
        print(f"JSON scan results of `{filename}` found in `{output_file}`")
    except subprocess.CalledProcessError as e:
        print(f"Error running semgrep command: {e}")


if __name__ == "__main__":
    run_semgrep()


# auto selenium
