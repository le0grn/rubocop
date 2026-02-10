# frozen_string_literal: true

module Shared
  class Navbar < Bridgetown::Component
    def initialize(metadata:, resource:)
      @metadata = metadata
      @resource = resource
    end
  end
end
