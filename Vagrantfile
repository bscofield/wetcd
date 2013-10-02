# -*- mode: ruby -*-
# vi: set ft=ruby :

# Vagrantfile API/syntax version. Don't touch unless you know what you're doing!
VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
  config.vm.box = "precise64"
  config.vm.box_url = "http://files.vagrantup.com/precise64.box"

  config.vm.network :private_network, ip: "192.168.10.10"

  config.vm.synced_folder ".", "/var/www/wetcd"

  config.vm.provision :ansible do |ansible|
    ansible.sudo = true
    ansible.verbose = 'v'
    ansible.inventory_path = "provisioning/ansible_hosts"
    ansible.playbook = "provisioning/playbook.yml"
  end
end
