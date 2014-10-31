class WebsocketChannel
  def self.find(channel_name, element_id = nil)
    channel_name = "#{channel_name}_#{element_id}" unless element_id.nil?
    WebsocketRails[channel_name]
  end
end
