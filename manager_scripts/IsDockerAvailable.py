import subprocess

def check():
    try:
        subprocess.run(['docker', 'version'], check=True, stdout=subprocess.PIPE)
    except subprocess.CalledProcessError:
        return False

    return True
