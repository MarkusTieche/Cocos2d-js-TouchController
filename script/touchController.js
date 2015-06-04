var touchController = cc.Layer.extend({
	
    
    ctor:function () {
        
        this._super();
        
        
        //ARRAY WHICH HOLDS ALL CONTROLL ELEMENTS
        this.controls = [];
        
        //HANDLE INPUT EVENTS
         cc.eventManager.addListener(cc.EventListener.create({
            		event: cc.EventListener.TOUCH_ALL_AT_ONCE,
                    swallowTouches: true,
             
                    onTouchesBegan: function (touches, event) {
                        var controls = event.getCurrentTarget().controls;
                        //FOR EACH TOUCH
                        for (var i = 0; i < touches.length; i++)
                        { 
                            var touch = touches[i]; //CURRENT TOUCH EVENT
                            var pos = touch.getLocation(); //TOUCH POSITION
                            
                            //CHECK TOUCH POSITION AGAINST EACH CONTROLL ELEMENT
                            for (var j = 0; j < controls.length; j++)
                            {
                                var dist = Math.sqrt((pos.x-controls[j].pos.x)*(pos.x-controls[j].pos.x) + (pos.y-controls[j].pos.y)*(pos.y-controls[j].pos.y));
                                //ON A INPUT ELEMENT
                                if(dist < controls[j].size)
                                {
                                    controls[j].touchStart(touch);
                                };
                            };
                        };
                    },
            		
                    onTouchesMoved:function (touches, event) {
                        
                        var controls = event.getCurrentTarget().controls; 
                        
                        //FOR EACH TOUCH
                        for (var i = 0; i < touches.length; i++)
                        { 
                            var touch = touches[i]; //CURRENT TOUCH EVENT
                            
                            //FOR EACH CONTROLL ELEMENT
                            for (var j = 0; j < controls.length; j++)
                            {
                                //IF TOUCH ID == CONTROLL ELEMENT TOUCH ID
                                if(touch.getID() == controls[j].touchID)
                                {
                                    //MOVE EMLEMENT
                                    controls[j].touchMove(touch);
                                };
                            };
                        };
            		},
                    
                    onTouchesEnded:function (touches, event) {
                         
                        var controls = event.getCurrentTarget().controls;
                        
                        //FOR EACH TOUCH
                        for (var i = 0; i < touches.length; i++)
                        { 
                            var touch = touches[i]; //CURRENT TOUCH EVENT
                            
                            //FOR EACH CONTROLL ELEMENT
                            for (var j = 0; j < controls.length; j++)
                            {
                                //IF TOUCH ID == CONTROLL ELEMENT TOUCH ID
                                if(touch.getID() == controls[j].touchID)
                                {
                                    controls[j].touchEnd();
                                };
                            };
                        };
            		}
            	}), this);
    },
    
    //ADD A NEW ANALOG STICK
    addStick:function(posX,posY)
    {
        //ADD ANALOG STICK BASE SPRITE
        var base = cc.Sprite.create("res/input/StickBase.png");
            base.setPosition(cc.p(posX,posY));
            this.addChild(base);
        
        //ADD ANALOG STICK SPRITE
        var stick = cc.Sprite.create("res/input/Stick.png"); // SET SPRITE
            stick.setPosition(cc.p(posX,posY)); // SET POSITION
            stick.pos = {x:posX,y:posY}; // SAVE START POSITION
            stick.size = 40; // TOUCH SIZE / MOVABLE RADIUS SIZE
            stick.startPos = {x:0,y:0}; // TOUCH START POSITION
            stick.input = {x:0,y:0}; // CURRENT INPUT VALUE
            stick.touchID = -1; // TOUCH ID
            stick.opacity = 150; // LOW OPACITY 0-255
            
        this.addChild(stick); //ADD STICK TO SCENE
        
            // ON TOUCH START
            stick.touchStart = function(touch)
            {
            	this.startPos = {x:touch.getLocation().x,y:touch.getLocation().y}; //GET TOUCH START POSITION           
                this.opacity = 255; //SET FULL OPACITY
                this.touchID = touch.getID(); //GET TOUCH ID
            };
        
            // ON TOUCH MOVE
            stick.touchMove = function(touch)
            {
                
                var pos = touch.getLocation(); //CURRENT LOCATION
                
                var dx = touch.getLocation().x - this.startPos.x; //MOVED IN X DIRECTION
                var dy = touch.getLocation().y - this.startPos.y; //MOVED IN Y DIRECTION
                
                var r = Math.sqrt(dx * dx + dy * dy); //GET MOVE DISTANCE
                        
                var _r = Math.min(r, this.size); //KEEP DISTANCE BETWEEN 0 - SIZE
                        
                dx = dx * _r / r; 
                
                //RECALCULATE dx based on _r
                if (isNaN(dx) === true) {
                	dx = 0.0;
                }
                
                //RECALCULATE dy based on _r
                dy = dy * _r / r;
                if (isNaN(dy) === true) {
                	dy = 0.0;
                }                
          
                //UPDATE STICK POSITION
                this.setPosition(cc.p(this.pos.x+dx,this.pos.y+dy));
                
                //UPDATE INPUT VALUE TO STAY BETWEEN -1 and 1;
                this.input = {x:dx/this.size,y:dy/this.size};
                
                console.log(this.input.x)
                
            };
            
            // ON TOUCH END
            stick.touchEnd = function()
            {
                this.setPosition(cc.p(this.pos.x,this.pos.y)); // SET POSITION TO 0,0
                this.opacity = 150; // SET OPACITY
                this.touchID = -1; // REMOVE TOUCH ID
                this.input = {x:0,y:0}; //RESET INPUT VALUE
            };
        
            //GET ANGLE FROM STICK
            stick.getAngle = function()
            {
                return  Math.atan2(this.input.x, this.input.y)* 180/Math.PI;
            }
        
        this.controls.push(stick); //ADD STICK TO CONTROLL ARRAY
        
        return stick; //RETURN STICK FOR EASY ACCESS
    },
    
    //ADD A NEW BUTTON
    addButton:function(posX,posY)
    {
        var button = cc.Sprite.create("res/input/button.png"); // SET SPRITE
            button.setPosition(cc.p(posX,posY)); //SET POSITION
            button.pos = {x:posX,y:posY}; // SAVE START POSITION
            button.opacity = 150; //SET OPACITY
            button.size = 40; // TOUCH SIZE
            button.input = false; // CURRENT INPUT VALUE
            button.touchID = -1; // TOUCH ID
            
        this.addChild(button); //ADD BUTTON TO SCENE
            
        // ON TOUCH START
            button.touchStart = function(touch)
            {
                this.input = true; //SET INPUT TO TRUE
                this.opacity = 255; //SET FULL OPACITY
                this.touchID = touch.getID(); //GET TOUCH ID
            };
        
            button.touchMove = function(touch,target)
            {
            };
        
            button.touchEnd = function()
            {
                this.input = false; //SET INPUT TO FALSE
                this.opacity = 150; //SET LOW OPACITY
                this.touchID = -1; //REMOVE TOUCH ID
            };
        
        this.controls.push(button); //ADD STICK TO CONTROLL ARRAY
        
        return button; //RETURN STICK FOR EASY ACCESS
    }
})