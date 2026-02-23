import click
import manager_scripts
import subprocess

STACK_NAME = 'hackathon-2026'
STACK_FILE = 'docker-compose.yml'

@click.command()
def up():
    if not manager_scripts.IsDockerAvailable.check():
        click.secho("Docker is not available", fg='red')
        return
    click.secho("Docker is available\n", fg='green')


    if not manager_scripts.IsSwarmInitialized.check():
        click.secho('Swarm is not initialized', fg='red')
        click.echo('Try to initialize swarm\n')

        if not manager_scripts.IsSwarmInitialized.initialize():
            click.secho('Swarm is not initialized', fg='red')
            return

    click.secho("Swarm is initialized\n", fg='green')

    if not manager_scripts.AreNetworksCorrect.check():
        return
    click.secho("Networks are correct\n", fg='green')

    manager_scripts.BuildImages.build()

    manager_scripts.Certs.create()

    subprocess.run(['docker', 'stack', 'deploy', '-c', STACK_FILE, STACK_NAME],
                   stdout=subprocess.PIPE, stderr=subprocess.PIPE)

    subprocess.run(['docker', 'stack', 'services', STACK_NAME])

@click.command()
def down():
    subprocess.run(['docker', 'stack', 'rm', STACK_NAME])
    click.secho("Stack is down", fg='green')

@click.command()
def status():
    subprocess.run(['docker', 'stack', 'services', STACK_NAME])

@click.command()
@click.argument('service')
def logs(service):
    if service is None:
        click.secho('Service is required', fg='red')

    subprocess.run(['docker', 'service', 'logs', service, '-f'])

@click.command()
def redeploy():
    click.echo('Removing old stacks\n')
    subprocess.run(['docker', 'stack', 'rm', STACK_NAME], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    manager_scripts.BuildImages.build()

    subprocess.run(['docker', 'stack', 'deploy', '-c', STACK_FILE, STACK_NAME],
                   stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    click.secho('Stack is deployed', fg='green')


@click.group()
def cli():
    pass

cli.add_command(up)
cli.add_command(down)
cli.add_command(status)
cli.add_command(logs)
cli.add_command(redeploy)

if __name__ == '__main__':
    cli()
