import subprocess
import click

images = [['backend-hackathon-2026:1.0.0', './backend'], ['frontend-hackathon-2026:1.0.0', './frontend']]

def build():
    for image in images:
        click.secho('Building image: {}\n'.format(image[0]), fg='green')

        if image[1] == './backend':
            subprocess.run(['docker', 'build', '-t', image[0], image[1]],
                                   stdout=subprocess.PIPE, stderr=subprocess.PIPE)

        subprocess.run(['docker', 'build', '-t', image[0], image[1]],
                       stdout=subprocess.PIPE, stderr=subprocess.PIPE)
