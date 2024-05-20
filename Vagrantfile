Vagrant.configure("2") do |config|
    config.vm.box = "perk/ubuntu-2204-arm64"
  
    config.vm.provider "qemu" do |qe|
      qe.arch = "x86_64"
      qe.cpu = "cortex-a72"
      qe.smp = "cpus=2,sockets=1,cores=2,threads=1"
      qe.net_device = "virtio-net-pci"
      qe.memory = "2G"
      qe.machine = "q35,virt,accel=hvf,highmem=on"
      # qe.extra_qemu_args = %w(thread=multi,tb-size=512)
      # qe.qemu_dir = "/usr/local/share/qemu"
    end
  end