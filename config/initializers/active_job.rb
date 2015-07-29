require 'active_job'
# or any other supported backend such as :sidekiq or :delayed_job
ActiveJob::Base.queue_adapter = :sidekiq
