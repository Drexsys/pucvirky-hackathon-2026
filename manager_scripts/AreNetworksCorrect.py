import subprocess
import click

networks = ['hackathon-2026-public', 'hackathon-2026-private']

def init_networks(network):
    click.echo('Initializing {} network...'.format(network))
    try:
        subprocess.run(['docker', 'network', 'create', '-d', 'overlay', network],
                       check=True, stdout=subprocess.PIPE)
    except subprocess.CalledProcessError:
        click.secho('Network {} not created.'.format(network), fg='red')
        return False

    click.secho('Initializing {} was successful\n'.format(network), fg='green')
    return True

def check():
    for network in networks:
        response = subprocess.run(['docker', 'network', 'ls',
                                   '--filter', f'name={network}','--format', '{{.Driver}}'],
                        stdout=subprocess.PIPE, check=True, text=True)

        if response.stdout == '':
            click.secho('Network {} not found.'.format(network), fg='red')
            if not init_networks(network):
                return False

        if response.stdout == 'bridge\n':
            click.secho('Network {} is bridge.'.format(network), fg='red')

            click.echo('Removing not correct network')
            subprocess.run(['docker', 'network', 'rm', network],
                           check=True, stdout=subprocess.PIPE)

            if not init_networks(network):
                return False

    return True
