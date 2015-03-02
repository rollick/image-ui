var padding = 15,
    min_x = padding,
    min_y = padding,

// Global as they need to be reset in the route
filled_areas = new Array();
max_x = 0;
max_y = 0;

function check_overlap(area) {
    for (var i = 0; i < filled_areas.length; i++) {
        check_area = filled_areas[i];
        
        var bottom1 = area.y + area.height;
            bottom2 = check_area.y + check_area.height,
            top1 = area.y,
            top2 = check_area.y,
            left1 = area.x,
            left2 = check_area.x,
            right1 = area.x + area.width,
            right2 = check_area.x + check_area.width;

        if (bottom1 < top2 || top1 > bottom2 || right1 < left2 || left1 > right2) {
            continue;
        }
        return true;
    }
    return false;
};

Template.GalleryLink.rendered = function() {
    var element = $(this.firstNode),
        rand_x = 0,
        rand_y = 0,
        width = element.width(),
        height = element.height(),
        area;

    do {
        rand_x = Math.round(min_x + ((max_x - min_x - width - padding)*(Math.random() % 1)));
        rand_y = Math.round(min_y + ((max_y - min_y - height - padding)*(Math.random() % 1)));
        area = {x: rand_x, y: rand_y, width: width, height: height};
    } while(check_overlap(area));
    
    filled_areas.push(area);

    // display gallery link with random delay
    var items = [100, 200, 300, 400, 500],
        delay = items[Math.floor(Math.random()*items.length)];

    element.css({left:rand_x, top: rand_y}).delay(delay).addClass('show');
};
