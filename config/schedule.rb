
env :PATH, ENV['PATH']
set :output, 'log/cron.log'

every 1.hour, at: 30, :roles => [:app] do
  runner "GetLocationsWorker.new.perform"
end

every 1.hour, :roles => [:app] do
  runner "GetNewsWorker.new.perform"
end