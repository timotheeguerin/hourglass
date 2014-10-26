class WebShot
  attr_accessor :options

  def initialize(options = {})
    @headless = Headless.new
    @headless.start

    @options = default_options.merge(options)

    @driver = Selenium::WebDriver.for(@options[:driver])
    @driver.manage.timeouts.implicit_wait = @options[:timeout]
    @driver.manage.timeouts.script_timeout = @options[:timeout]
    @driver.manage.timeouts.page_load = @options[:timeout]
    @driver.manage.window.resize_to(@options[:viewport_width], @options[:viewport_heigth])
  end

  def screenshot(url, output)
    puts "Url: #{url}"
    begin
      @driver.navigate.to(url.to_s)
    rescue Selenium::WebDriver::Error::TimeOutError

    end
    @driver.save_screenshot(output)
  end

  # Generate thumbnails of the given url
  # @param url: url to screenshot
  # @param output: output file, if nil return the file object
  def thumbnails(url, output=nil)
    file = Tempfile.new('foo')

    #Take a fullsize screenshot and save it in a tmp file
    screenshot(url, file.path)

    #Resize image to a thumbnail
    img = Magick::Image::read(file.path).first
    thumb = img.scale(@options[:thumbnails_width], (@options[:thumbnails_width] * img.rows)/img.columns)
    if output.nil?
      StringIO.open(thumb.to_blob)
    else
      thumb.write(output)
    end
  end

  def close
    @driver.quit
    @headless.stop
    @headless.destroy
  end

  private
  def default_options
    {driver: :firefox, thumbnails_width: 256, viewport_width: 1280, viewport_heigth: 800, timeout: 5}
  end
end
