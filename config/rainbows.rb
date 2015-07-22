worker_processes 1 # assuming four CPU cores
Rainbows! do
    use :FiberSpawn
      worker_connections 100
end

preload_app true
GC.respond_to?(:copy_on_write_friendly=) and GC.copy_on_write_friendly = true
