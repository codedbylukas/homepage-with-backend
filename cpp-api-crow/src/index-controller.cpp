#include "index-controller.hpp"
#include "crow.h"
#include <iostream>

void setup_route_index(crow::SimpleApp& app) {
    CROW_ROUTE(app, "/")([](){
        return crow::response(200, "Diese Api ist nicht dazu gedacht, dass man sie einfach so im Webbrowser hernimmt. Sie ist eigentlich dazu gedacht, die Anfragen des Frontends engegenzunehmen. Dies ist natürlich keine Pflicht, aber eine große Empfehlung, da du hier warscheinlich keinen Spass haben wirst. ");
    });
}
