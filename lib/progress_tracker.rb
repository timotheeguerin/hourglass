class ProgressTracker

  def initialize(weight = 100)
    @weight = 100
    @completed = 0
    @subscribers = []
  end

  def run(weight, &block)
    yield
    update(weight)
  end

  def sub(weight, &block)
    before_sub = @completed
    sub = ProgressTracker.new(weight)
    sub.on_update do |_, updated_of|
      update((updated_of * weight).to_f / 100)
    end
    block.call(sub)
    if @completed != before_sub + weight
      update(before_sub + weight - @completed)
    end
  end

  def on_update(&block)
    @subscribers << block
  end


  def ratio
    @completed.to_f / 100
  end

  def global_ratio
    @completed.to_f / @weight
  end

  def update(weight)
    @completed += weight
    @subscribers.each do |subscriber|
      subscriber.call(@completed, weight)
    end
  end
end