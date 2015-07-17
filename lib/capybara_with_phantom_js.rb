require 'capybara'
require 'capybara/poltergeist'

module CapybaraWithPhantomJs
  include Capybara::DSL

  # Create a new PhantomJS session in Capybara
  def new_session

    # Register PhantomJS (aka poltergeist) as the driver to use
    Capybara.register_driver :poltergeist do |app|
      Capybara::Poltergeist::Driver.new(app,{js_errors: false })
    end

    # Start up a new thread
    @session = Capybara::Session.new(:poltergeist)

    # Report using a particular user agent
    @session.driver.headers = { 'User-Agent' =>
      "Mozilla/4.0 (compatible; MSIE 6.1; Windows XP)" }

    # Return the driver's session
    @session
  end

  # Returns the current session's page
  def html
    session.html
  end
end