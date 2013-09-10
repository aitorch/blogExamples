# --- Preinstall Stage ---#

stage { 'preinstall':
  before => Stage['main']
}

# Define the apt_get_update class
class apt_get_update {
  exec { 'apt-get -y update':
    path => ['/usr/sbin', '/usr/bin', '/sbin', '/bin']
  }
}

# Declare (invoke) the apt_get_update
class { 'apt_get_update':
  stage => preinstall
}

# --- NodeJS --- #

class { 'nodejs':
  version => 'v0.10.5'
}

# install global NPM packages

package { "grunt-cli":
  ensure => "0.1.7",
  provider => "npm"
}

# install local NPM packages

exec { 'npm_install':
  command => '/usr/local/bin/npm install --no-bin-links',
  cwd => "/vagrant",
  require =>  Class['nodejs'],
}

