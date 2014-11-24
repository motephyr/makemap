CarrierWave.configure do |config|

  # For testing, upload files to local `tmp` folder.
  if Rails.env.test? || Rails.env.development? || Rails.env.cucumber?
    config.storage = :file
  else
    config.storage = :fog

    config.fog_credentials = {
      # Configuration for Amazon S3 should be made available through an Environment variable.
      # For local installations, export the env variable through the shell OR
      # if using Passenger, set an Apache environment variable.
      #
      # In Heroku, follow http://devcenter.heroku.com/articles/config-vars
      #
      # $ heroku config:add S3_KEY=your_s3_access_key S3_SECRET=your_s3_secret S3_REGION=eu-west-1 S3_ASSET_URL=http://assets.example.com/ S3_BUCKET_NAME=s3_bucket/folder

      # Configuration for Amazon S3
      :provider              => 'AWS',
      :aws_access_key_id     => Setting.S3_KEY,
      :aws_secret_access_key => Setting.S3_SECRET,
      :region                => Setting.S3_REGION
    }
    config.cache_dir = "#{Rails.root}/tmp/uploads"                  # To let CarrierWave work on heroku

    config.fog_directory    = Setting.S3_BUCKET_NAME
    #config.s3_access_policy = :public_read                          # Generate http:// urls. Defaults to :authenticated_read (https://)
    config.fog_public = true

  end

end