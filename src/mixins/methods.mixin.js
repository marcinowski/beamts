import { SvgHandler } from "./svg.handler";
// import { CanvasHandler } from "./canvas.handler";

const methodsMixin = {
  methods: {
    addEventListener(name, f, prop) {
      this.svg.addEventListener(name, f, prop);
      if (this.events == null) {
        this.events = [];
      }
      this.events.push({ name, f, prop });
    },
    clearEventListeners() {
      this.events.forEach(i =>
        this.svg.removeEventListener(i.name, i.f, i.prop)
      );
      this.events = [];
    },
    handleLines: function() {
      const draw = new SvgHandler(this.svg);
      this.addEventListener(
        "click",
        function(e) {
          draw.drawLineFromEvent(e);
        },
        false
      );
    },
    handlePoints: function() {
      const draw = new SvgHandler(this.svg);

      this.addEventListener(
        "click",
        function(e) {
          draw.drawPointFromEvent(e);
        },
        false
      );
    },
    handleSelect: function() {
      const draw = new SvgHandler(this.svg);

      ["mousedown", "mousemove", "mouseup"].forEach(ev =>
        this.addEventListener(
          ev,
          function(e) {
            draw.drawSelectionFromEvent(e);
          },
          false
        )
      );
    },
    handleMethod: function(method) {
      this.clearEventListeners();
      switch (method) {
        case 1: {
          console.log("Cursor");
          this.handleCoursor();
          break;
        }
        case 2: {
          console.log("Select");
          this.handleSelect();
          break;
        }
        case 3: {
          console.log("Points");
          this.handlePoints();
          break;
        }
        case 4: {
          console.log("Drawing");
          this.handleLines();
          break;
        }
      }
    }
  }
};

export default methodsMixin;
