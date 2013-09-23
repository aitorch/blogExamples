$as_vagrant = 'sudo -u vagrant -H bash -l -c'

Exec {
  path => ['/usr/sbin', '/usr/bin', '/usr/local/bin', '/sbin', '/bin']
}

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

# --- Packages ---#

package { 'git':
  ensure => 'installed'
}

package { 'git-core':
  ensure => installed
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

package { "bower":
  ensure => "1.0.3",
  provider => "npm"
}

# install local NPM packages

exec { 'npm_install':
  command => '/usr/local/bin/npm install --no-bin-links',
  cwd => "/vagrant",
  require =>  Class['nodejs'],
}

# install bower packages
exec { 'bower_install':
  command => "${as_vagrant} '/usr/local/bin/bower install'",
  cwd => "/vagrant",
  require => Package['bower']
}
