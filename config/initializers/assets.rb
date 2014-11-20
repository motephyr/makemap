Rails.application.config.assets.precompile << Proc.new do |path|
  if path =~ /\.(css|js)\z/ && !path =~ /\.(bootstrap|jquery)\z/
    full_path = Rails.application.assets.resolve(path).to_path
    count = Rails.application.config.assets.paths.select {|app_assets_path|  full_path.starts_with? app_assets_path.to_s }.length
    if count > 0
      puts "including asset: " + full_path
      true
    else
      puts "excluding asset: " + full_path
      false
    end
  else
    false
  end
end