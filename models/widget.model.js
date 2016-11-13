var widgetModel = {
    "id": "/WidgetModel",
    "type": "object",
    "properties": {
      "id": {"type": "number"},
      "name": {"type": "string"},
      "color": {"type": "string"},
      "price": {"type": "string"},
      "iventory": {"type": "number"},
      "melts": { "type": "boolean" }
    }
}

module.exports = widgetModel;