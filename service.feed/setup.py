from distutils.core import setup

setup(
    name='Insta.Clone',
    version='0.1dev',
    packages=['lib'],
    license='Private',
    long_description=open('Readme.md').read(),
)

from lib import runner
