import subprocess

def initialize():
    try:
        subprocess.run(['docker', 'swarm', 'init', '--advertise-addr', '127.0.0.1'], check=True)

    except subprocess.CalledProcessError:
        return False

    return True

def check():
    try:
        response = subprocess.run(['docker', 'info', '--format', '{{.Swarm.LocalNodeState}}'],
                                  check=True, stdout=subprocess.PIPE, text=True)
        if response.stdout == 'inactive\n':
            return False
    except subprocess.CalledProcessError:
        return False

    return True
