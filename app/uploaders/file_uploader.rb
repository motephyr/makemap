# encoding: utf-8

class FileUploader < CarrierWave::Uploader::Base
  storage :file
end
