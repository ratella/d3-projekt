
                                <div class="containerbud">  
                                    <div class="span-24 last">           
                                        <h3><a href="#costs">Monatliches Budget 950€</a></h3> 
                                        <p>Monatliche Ausgabenübersicht</p>            
                                        <div id="chartbudContainerbud">
                                        </div>
                                        <div id="breadcrumbsbud">
                                        </div>
                                        <script type="text/javascript"> 
                                            var entryIdMap = {};
                                            var entries = new DataArray();
                                            var budget = { name: "zur Gesamtübersicht", entries:[] }; 
                                            var selectedCategory; 
                                            var chartbud;  
                                            var w = 25;
                                            var h = 10;   
                                            
                                        
                                            
                                            var historyStack = [];
                                            
                                            function rebuildBreadcrumbsbud() {
                                                var breadcrumbsbud = d3.select("#breadcrumbsbud");    
                                                var breadcrumbsbudLinks = breadcrumbsbud.selectAll("a")
                                                    .data(historyStack);
                                                    
                                                breadcrumbsbudLinks.enter()
                                                    .append("a")
                                                    .attr("href", function(d, i) {
                                                        return "javascript:goToBreadcrumb(" + i + ")";
                                                    })
                                                    .text(function(d) { return d.name + ""; })
                                                    
                                                breadcrumbsbudLinks.exit()
                                                    .remove("")
                                            }
                                            
                                            function goToBreadcrumb(i) {
                                                var clicked = historyStack[i];               
                                                historyStack.splice(i, historyStack.length - i);
                                                rebuildBreadcrumbsbud();
                                                chartbud.selectAll("g").remove();
                                                rebuildVis(clicked);
                                            }
                                    
                                            function findMinScaleAndPad(n) { 
                                                if (n == 0) return 0;
                                                
                                                var scale = 1;
                                                var result = 0;
                                                
                                                while(result == 0 && scale < 1000) {
                                                    scale *= 10;
                                                    result = Math.floor(n);
                                                }
                                                
                                                var scaleStr = "" + scale;
                                                var resultStr = "" + result;
                                                while(resultStr.length < scaleStr.length - 1) {
                                                    resultStr = "0" + resultStr;
                                                }
                                                return resultStr;
                                            } 
                                            
                                            function numberToAmountStr(n) { 
                                                var normalized = 1*n;
                                                var eu = Math.floor(normalized);
                                                var gr = findMinScaleAndPad(normalized);
                                                if (gr == 0) {
                                                    gr = Math.floor((normalized)*1000);
                                                }
                                                var result = "";
                                                if (eu > 0) {
                                                    result 
                                                }
                                                else {
                                                    result 
                                                }
                                                
                                                if (gr > 0) {
                                                    result += gr;
                                                }
                                                else {
                                                    result //Zahl unter Kategorie             
                                                }
                                                
                                                return result + " €"; 
                                            }
                                            
                                            function init() {  
                                                chartbud = d3.select("#chartbudContainerbud").append("svg:svg");    
                                                var chartbudDefs = chartbud.append("svg:defs"); 
                                                var pattern = chartbudDefs.append("svg:pattern");
                                                pattern.attr("patternUnits", "userSpaceOnUse");
                                                pattern.attr("x", "0");             
                                                pattern.attr("y", "0");
                                                pattern.attr("width", "5");
                                                pattern.attr("height", "5");
                                                pattern.attr("id", "stripesPattern");
                                                var patternPath = pattern.append("svg:path");
                                                patternPath.attr("d", "M 0,0 0,1 1,1 1,0 0,0 z M 1,1 1,2 2,2 2,1 1,1 z M 2,2 2,3 3,3 3,2 2,2 z M 3,3 3,4 4,4 4,3 3,3 z m 1,1 0,1.0000001 1,0 L 5,4 4,4 z");
                                                patternPath.attr("style", "fill:#000000;fill-opacity:1;stroke:none");
                                                chartbud.attr("id", "chartbud");
                                                d3.xhr("data/unterteilung_ausgaben.csv", function(text) {  //Die UNterteilung
                                                    var lines = text.responseText.split("\n");
                                                    for(var i in lines) {
                                                        var line = lines[i].replace(/"/g, '');  
                                                        if (!line) continue;   
                                                        if (i==0) continue;  //header
                                                        if (i==1) continue;  //total
                                                        var params = line.split(";");   
                                                                                
                                                        var entry = {     
                                                            id: params[0],
                                                            parent: params[1],
                                                            level: params[2],
                                                            name: params[4],
                                                            part: params[5],
                                                            v_total: Number(params[6]), 
                                                            entries: []                     
                                                        }      
                                                    
                                                        entries.add(entry);            
                                                        
                                                        entryIdMap[entry.id] = entry;
                                                        if (entry.parent) {
                                                            entryIdMap[entry.parent].entries.push(entry);
                                                        }   
                                                        else {
                                                            budget.entries.push(entry);
                                                        }                   
                                                    }     
                                                
                                                    rebuildVis(budget);
                                                    
                                                });        
                                            }   
                                            
                                            function rebuildVis(parent) {
                                                historyStack.push(parent);
                                                rebuildBreadcrumbsbud();
                                                
                                                var total = 0; 
                                                parent.entries.forEach(function(funkcja) {    
                                                    total += funkcja.v_total;
                                                });
                                            
                                                var totalWidth = 448; //Breite des Diagrammes
                                                var minWidth = 12;  
                                                var reminingWidth = totalWidth - parent.entries.length * minWidth - parent.entries.length;
                                                var dx = 0;
                                                var i = 0;
                                                var barsDy = 140;
                                                
                                                var barGroup = chartbud.selectAll("rect.active")
                                                    .data(parent.entries)
                                                    .enter().append("svg:g")
                                                    .attr("transform", "translate(0, " + barsDy + ")");
                                                                
                                                barGroup.append("svg:rect")
                                                    .attr("width", function(d) {
                                                        var w = minWidth + Math.round(reminingWidth * d.v_total / total);                           
                                                        d.dx = dx;  
                                                        d.barWidth = w;                 
                                                        dx += w + 1;
                                                        return w + "px"
                                                    })
                                                    .attr("height", "130px") //HÖHE
                                                    .attr("x", function(d) {                            
                                                        return d.dx + "px";
                                                    })
                                                    .attr("y", 0)
                                                    .attr("rx", 5)
                                                    .attr("ry", 5)                      
                                                    .attr("class", "bar active");
                                                
                                                dx = 0; 
                                                barGroup.append("svg:rect")
                                                    .attr("width", function(d) {
                                                        var w = minWidth + Math.round(reminingWidth * d.v_total / total);                           
                                                        d.dx = dx;                      
                                                        dx += w + 1;
                                                        return w + "px"
                                                    })
                                                    .attr("height", function(d) { return (256 * (1.0 - d.v_proce_nation/100)) + "px"; } )
                                                    .attr("x", function(d) {                            
                                                        return d.dx + "px";
                                                    })
                                                    .attr("y", 0)
                                                    .attr("rx", 5)
                                                    .attr("ry", 5)                      
                                                    .attr("class", "eu")
                                                    .style("fill-opacity", 0)
                                                    .transition().delay(100).duration(1000)
                                                        .style("fill-opacity", 1)
                                                    
                                                barGroup.on('click', function(d, i) {
                                                        if (d.type == "Wurzel") {
                                                            d3.select(this.childNodes[0])
                                                                .style("fill-opacity", 0.25)
                                                                .transition()
                                                                    .style("fill-opacity", 1.0)
                                                            return;
                                                        }
                                                        var groups = chartbud.selectAll("g");                                           
                                                        var clicked = this;                                             
                                                        var clickedGroupIndex = groups[0].indexOf(clicked);
                                                        chartbud.selectAll("rect.active").transition()                              
                                                            .duration(750)
                                                            .delay(function() { return (this == clicked.childNodes[0]) ? 50 : 0})
                                                            .attr("x", function(d, i) { return (i <= clickedGroupIndex ? 0 : totalWidth) + "px";})
                                                            .attr("width", function() { return (this == clicked.childNodes[0]) ? (totalWidth) + "px" : "0px"})
                                                        chartbud.selectAll("rect.eu").transition()                              
                                                            .duration(750)
                                                            .delay(function() { return (this == clicked.childNodes[1]) ? 50 : 0})
                                                            .attr("x", function(d, i) { return (i <= clickedGroupIndex ? 0 : totalWidth) + "px";})
                                                            .attr("width", function() { return (this == clicked.childNodes[1]) ? (totalWidth) + "px" : "0px"})
                                                            .each("end", function(d) {
                                                                chartbud.selectAll("rect.active")
                                                                    .attr("class", "bar");                                  
                                                                if (this != clicked.childNodes[1]) {
                                                                    d3.select(this.parentNode).remove();
                                                                }
                                                                else {                                  
                                                                    d3.select(this.parentNode.childNodes[0]).transition()
                                                                        .style("fill-opacity", 0);
                                                                    d3.select(this.parentNode.childNodes[1]).transition()
                                                                        .style("fill-opacity", 0)
                                                                        .each("end", function() {
                                                                            d3.select(this.parentNode).remove();
                                                                        })
                                                                    rebuildVis(d);
                                                                }                                                           
                                                            })
                                                        chartbud.selectAll("text").transition()
                                                            .style("fill-opacity", 0)
                                                        chartbud.selectAll("line").transition()
                                                            .style("stroke-opacity", 0)
                                                });
                                                
                                                barGroup.on('mouseover', function(d, i) {
                                                    var selected = this;
                                                    var groups = chartbud.selectAll("g");
                                                    groups.attr("class", function() {
                                                        return (this == selected) ? "in" : "out";
                                                    });
                                                    
                                                    var title = d3.select(selected.childNodes[2]);
                                                });
                                                
                                                barGroup.on('mouseout', function(d, i) {
                                                    var groups = chartbud.selectAll("g");
                                                    groups.attr("class", "");
                                                });
                                                
                                                var itemMarginX = 40;
                                                var levelHeight = 50;               
                                                var levelsAbove = [{y:-40, items:[]}];
                                                var levelsBelow = [{y:285, items:[]}];
                                                
                                                function findNextTitleSpace(startX, endX, width, above) {
                                                    var levels = above ? levelsAbove : levelsBelow;
                                                    var ydirection = above ? -1 : 1;
                                                    var result = {x: 2000, y: 0};
                                                    var minX = Math.min(startX, totalWidth - width);
                                                    var maxX = Math.min(endX + width/2 - 5, totalWidth - width);
                                                    var found = false;
                                                    for(var l=0; l<levels.length; l++) {
                                                        var level = levels[l];
                                                        var currX = 0;                  
                                                        for(var i=0; i<level.items.length; i++) {
                                                            var item = level.items[i];
                                                            currX = item.x + item.width + itemMarginX;
                                                            if (currX < minX) currX = minX;
                                                            if (currX >= minX && currX <= maxX) {
                                                                if (i < level.items.length - 1 && currX + width < level.items[i+1].x - itemMarginX) {
                                                                    result.x = currX;
                                                                    level.items.push({x:result.x, width:width})
                                                                    found = true;
                                                                }
                                                            }
                                                        }
                                                                            
                                                        if (!found && currX < maxX) {
                                                            result.x = Math.max(minX, currX);
                                                            level.items.push({x:result.x, width:width})
                                                            found = true;
                                                        }
                                                        
                                                        if (found) {
                                                            result.y = level.y;
                                                            break;
                                                        }
                                                        else {
                                                            //add new level if we reached the last one
                                                            if (l == levels.length - 1 && levels.length < 10) {
                                                                levels.push({y:level.y + ydirection * levelHeight, items:[]});
                                                            }
                                                        }
                                                    }
                                                    return result;
                                                }
                                            
                                                var titleBelowAbove = -10;
                                                var titleBelowDy = 280;
                                                barGroup.append("svg:text") 
                                                    .text(function(d) {return d.name.replace(" ", " ")})
                                                    .attr("class", "label")                 
                                                    .attr("y", function(d, i) {
                                                        var center = d.dx + d.barWidth/2;
                                                        var above = (i % 2 == 0);
                                                        d.linePos = [];
                                                        d.linePos.push({x:center.x, y: above ? -2 : 200});
                                                        var width = this.offsetWidth ? this.offsetWidth : this.getClientRects()[0].width;
                                                        d.titlePos = findNextTitleSpace(center - d.barWidth/2, center - width/2 + 5, width, above);
                                                        d.linePos.push({x:center.x, y: above ? d.titlePos.y + 16 : d.titlePos.y - 12});
                                                        return d.titlePos.y;                        
                                                    })
                                                    .attr("x", function(d, i) {
                                                        return d.titlePos.x;
                                                    })
                                                    .style("fill-opacity", 0)
                                                    .transition()
                                                        .style("fill-opacity", 1);
                                                
                                                barGroup.append("svg:text") 
                                                    .text(function(d) {
                                                        return numberToAmountStr(d.v_total);
                                                    })
                                                    .attr("class", "number")                    
                                                    .attr("y", function(d, i) {
                                                        return d.titlePos.y + 12;
                                                    })
                                                    .attr("x", function(d, i) {
                                                        return d.titlePos.x;
                                                    })
                                                    .style("fill-opacity", 0)
                                                    .transition()
                                                        .style("fill-opacity", 1);
                                                    
                                                barGroup.append("svg:line")
                                                    .attr("x1", function(d) { return Math.floor(Math.max(d.dx, d.titlePos.x)) + 5.5; })
                                                    .attr("x2", function(d) { return Math.floor(Math.max(d.dx, d.titlePos.x)) + 5.5; })
                                                    .attr("y1", function(d) { return d.linePos[0].y; })
                                                    .attr("y2", function(d) { return d.linePos[1].y; })
                                                    .style("stroke-opacity", 0)
                                                    .transition()
                                                        .style("stroke-opacity", 1)
                                                
                                            }
                                            
                                            window.onload = init;
                                        
                                        </script>  

                                    </div> 
                                </div>

            </div> 