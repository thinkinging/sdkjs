    OfficeExcel.DrawKey = function (obj, key, colors)
    {
        var context = obj.context;
        context.lineWidth = 1;

        context.beginPath();

        /**
        * Account for null values in the key
        */
        var key_non_null    = [];
        var colors_non_null = [];
        for (var i=0; i<key.length; ++i) {
            if (key[i] != null) {
                colors_non_null.push(colors[i]);
                key_non_null.push(key[i]);
            }
        }
        
        key    = key_non_null;
        colors = colors_non_null;

		OfficeExcel.DrawKey_graph(obj, key, colors);
    }

    OfficeExcel.DrawKey_graph = function (obj, key, colors)
    {
        var canvas      = obj.canvas;
        var context     = obj.context;
        var text_size   = typeof(obj._otherProps._key_text_size) == 'number' ? obj._otherProps._key_text_size : obj._otherProps._text_size;
        var text_font   = obj._otherProps._key_text_font;
        
        var gutterLeft   = obj._chartGutter._left;
        var gutterRight  = obj._chartGutter._right;
        var gutterTop    = obj._chartGutter._top;

        var hpos        = obj._otherProps._yaxispos == 'right' ? gutterLeft + 10 : OfficeExcel.GetWidth(obj) - gutterRight - 10;
        var vpos        = gutterTop + 10;
        var blob_size   = text_size; // The blob of color
        var width        = 0;
		var scale = 1;
		if(OfficeExcel.drawingCtxCharts && OfficeExcel.drawingCtxCharts.scaleFactor)
			scale = OfficeExcel.drawingCtxCharts.scaleFactor;
		
		var sizeLine = 26*scale;
		if(bar._otherProps._key_color_shape != 'line')
			sizeLine = 8*scale;


        // Need to set this so that measuring the text works out OK
        context.font = text_size + 'pt ' + obj._otherProps._text_font;

        // Work out the longest bit of text
        for (i=0; i<key.length; ++i) {
            width = Math.max(width, context.measureText(key[i]).width);
        }
        var textWidth = width;
        
        width += 5;
        width += blob_size;
        width += 5;
        width += 5;
        width += 5;

        /**
        * Now we know the width, we can move the key left more accurately
        */
        if (   obj._otherProps._yaxispos == 'left'
            || (obj.type == 'pie' && !obj._otherProps._yaxispos)
            || (obj.type == 'hbar' && !obj._otherProps._yaxispos)
            || (obj.type == 'hbar' && obj._otherProps._yaxispos == 'center')
            || (obj.type == 'rscatter' && !obj._otherProps._yaxispos)
            || (obj.type == 'radar' && !obj._otherProps._yaxispos)
            || (obj.type == 'rose' && !obj._otherProps._yaxispos)
            || (obj.type == 'funnel' && !obj._otherProps._yaxispos)
            || (obj.type == 'vprogress' && !obj._otherProps._yaxispos)
            || (obj.type == 'hprogress' && !obj._otherProps._yaxispos)
           ) {

            hpos -= width;
        }

        /**
        * Horizontal alignment
        */
        
		var scale = 1;
		if(OfficeExcel.drawingCtxCharts && OfficeExcel.drawingCtxCharts.scaleFactor)
			scale = OfficeExcel.drawingCtxCharts.scaleFactor;
        var widthAllKey = 70*(key.length);
        /*if((obj._otherProps._key_halign == 'top' || obj._otherProps._key_halign == 'bottom' ))
		{
            if(widthAllKey > obj.canvas.width - 50)
			{
				var lengthKey = Math.round((obj.canvas.width - 50)/(70));
				if(lengthKey == 0)
					lengthKey = 1;
				obj._otherProps._key = obj._otherProps._key.slice(0,lengthKey);
                key = obj._otherProps._key;
			}
            widthAllKey = 70*(key.length);
		}*/
		
		var drwContext = OfficeExcel.drawingCtxCharts;
		var font = getFontProperties("key");
		if(obj._otherProps._key_halign == 'top' || obj._otherProps._key_halign == 'bottom' && key.length != 0)
		{
			widthAllKey = 0;
			var widthEveryElemKey = [];
			var widthKey;
			for(var l = 0; l < key.length; l++)
			{
				var props1 = getMaxPropertiesText(drwContext,font,key[l]);
				if(bar._otherProps._key_max_width)
					widthKey = bar._otherProps._key_max_width;
				else
					widthKey = props1.width;
				widthAllKey += widthKey + (3)*scale + sizeLine;
				widthEveryElemKey[l] = widthKey + (3)*scale + sizeLine;
			}
		}
		
		var heigthTextKey = 24;
		if(key && key.length != 0)
		{
			var props = getMaxPropertiesText(drwContext,font,bar._otherProps._key);
			heigthTextKey = (drwContext.getHeightText()/0.75)*scale;
		}
		
        var heightKeyVer = key.length*heigthTextKey;
        
        if (typeof(obj._otherProps._key_halign) == 'string') {
            if (obj._otherProps._key_halign == 'left') {
                hpos = calculatePosiitionObjects("key_hpos");
                vpos = canvas.height/2 - heightKeyVer/2;
            } else if (obj._otherProps._key_halign == 'right') {
                hpos = calculatePosiitionObjects("key_hpos");
                vpos = canvas.height/2 - heightKeyVer/2;
            }
            else if (obj._otherProps._key_halign == 'top') {
                hpos = canvas.width/2 - widthAllKey/2;
                vpos = calculatePosiitionObjects("key_hpos");
            }
            else if (obj._otherProps._key_halign == 'bottom') {
                hpos = canvas.width/2 - widthAllKey/2;
                vpos = calculatePosiitionObjects("key_hpos");
            }
        }

        // Draw the box that the key resides in
        context.beginPath();
            context.fillStyle   = 'white';
            context.strokeStyle = 'black';
        if('radar' == obj.type)
        {
            colors = obj._otherProps._strokecolor
        }

        context.beginPath();

            /**
            * Custom colors for the key
            */
            if (obj._otherProps._key_colors) {
                colors = obj._otherProps._key_colors;
            }
            //colors = OfficeExcel.array_reverse(colors);
            // Draw the labels given
            if( obj._otherProps._autoGrouping == 'stacked' ||  obj._otherProps._autoGrouping == 'stackedPer' ||  obj._otherProps._type != undefined && obj._otherProps._type == 'accumulative' && 'bar' == obj.type)
            {
                colors = OfficeExcel.array_reverse(colors)
                if('hbar' != obj.type)
                    key = OfficeExcel.array_reverse(key)
            }
           
            if(obj._otherProps._key_halign == 'bottom' || obj._otherProps._key_halign == 'top')
            {
                 
				var levels;
				if(obj._otherProps._key_levels)
					levels = obj._otherProps._key_levels;
				var gVpos = vpos;
				//если не умещается легенда, делаем её в несколько строк
				if(levels && levels.length)
				{
					
					var widthCurKey = 0;
					for(var i = 0; i < levels[0].length; i++)
					{
						widthCurKey += widthEveryElemKey[i];
					}
					hpos = (canvas.width - widthCurKey)/2;
					var startLevelNum = 0;
					var elemeNum = 0;;
					for (var i = 0; i < levels.length; i++) {
						startLevelNum = elemeNum;
						for(var j = 0; j < levels[i].length; j++)
						{
							// Draw the blob of color
							var leftDiff = 0;
							for(var n = startLevelNum ; n < elemeNum; n++)
							{
								leftDiff += widthEveryElemKey[n];
							}
							if(obj._otherProps._key_halign == 'top')
								vpos = gVpos + props.height*(i)*scale;
							else
								vpos = gVpos - props.height*(levels.length - i - 1)*scale;
							if (obj._otherProps._key_color_shape == 'line') {
								context.beginPath();
									context.strokeStyle = colors[elemeNum];
									context.lineWidth = '2.7'
										
										context.moveTo(hpos + leftDiff + 2*scale,vpos - props.height/2);
										context.lineTo(hpos + leftDiff + sizeLine + 2*scale, vpos - props.height/2);

								context.stroke();

							} else {
								context.fillStyle =  colors[elemeNum];
								context.fillRect(hpos + leftDiff + 2*scale, vpos - 7*scale, 7*scale, 7*scale);
							}

							context.beginPath();
						
							context.fillStyle = 'black';
							OfficeExcel.Text(context,
									text_font,
									text_size,
									hpos + leftDiff + sizeLine + 3*scale,
									vpos,
									levels[i][j]);
									
							elemeNum++;
						}
					}
				}				
				else
				{
					for (var i=0; i<key.length; i++) {
						// Draw the blob of color
						var leftDiff = 0;
						for(var n = 0 ; n < i; n++)
						{
							leftDiff += widthEveryElemKey[n];
						}
						
						
						if (obj._otherProps._key_color_shape == 'circle') {
							context.beginPath();
								context.strokeStyle = 'rgba(0,0,0,0)';
								context.fillStyle = colors[i];
								context.arc(hpos + 5 + (blob_size / 2), vpos + (5 * j) + (text_size * j) - text_size + (blob_size / 2), blob_size / 2, 0, 6.26, 0);
							context.fill();
						
						} else if (obj._otherProps._key_color_shape == 'line') {
							context.beginPath();
								context.strokeStyle = colors[i];
								context.lineWidth = '2.7'

									context.moveTo(hpos + leftDiff + 2*scale,vpos - props.height/2);
									context.lineTo(hpos + leftDiff + sizeLine + 2*scale, vpos - props.height/2);

							context.stroke();

						} else {
							context.fillStyle =  colors[i];
							context.fillRect(hpos + leftDiff + 2*scale, vpos - 7*scale, 7*scale, 7*scale);
							//context.fillRect(hpos, vpos + (10 * j) + (text_size * j) - text_size, 22, obj._otherProps._linewidth);
						}

						context.beginPath();
					
						context.fillStyle = 'black';
						OfficeExcel.Text(context,
								text_font,
								text_size,
								hpos + leftDiff + sizeLine + 3*scale,
								vpos,
								key[i]);
					}
				}	
            }
            else
            {
                for (var i=key.length - 1; i>=0; i--) {
            
                    var j = Number(i) + 1;
                    
                    // Draw the blob of color
                        
                    var diffKeyAndLine = 3*scale;
                    if (obj._otherProps._key_color_shape == 'circle') {
                        context.beginPath();
                            context.strokeStyle = 'rgba(0,0,0,0)';
                            context.fillStyle = colors[i];
                            context.arc(hpos + 5 + (blob_size / 2), vpos + (5 * j) + (text_size * j) - text_size + (blob_size / 2), blob_size / 2, 0, 6.26, 0);
                        context.fill();
                    
                    } else if (obj._otherProps._key_color_shape == 'line') {
                        context.beginPath();
                            context.strokeStyle = colors[i];
                            context.lineWidth = '2.7'

                            context.moveTo(hpos, vpos + heigthTextKey*j - heigthTextKey + (heigthTextKey / 2));
                            context.lineTo(hpos + sizeLine, vpos + heigthTextKey*j - heigthTextKey + (heigthTextKey / 2));
                            //context.moveTo(hpos + 5, vpos + (5 * j) + (text_size * j) - text_size + (blob_size / 2));
                            //context.lineTo(hpos + blob_size + 5, vpos + (5 * j) + (text_size * j) - text_size + (blob_size / 2));
                        context.stroke();

                    } else {
                        context.fillStyle =  colors[i];
                        context.fillRect(hpos, vpos + heigthTextKey*j - props.height/2 - 7*scale, 7*scale, 7*scale);
                        diffKeyAndLine = 5;
                    }

                    context.beginPath();
                
                    context.fillStyle = 'black';
                    
                    OfficeExcel.Text(context,
                            text_font,
                            text_size,
                            hpos + sizeLine + diffKeyAndLine,
                            vpos + heigthTextKey*j - props.height/2,
                            key[i]);
                }
            }

        context.fill();
    }