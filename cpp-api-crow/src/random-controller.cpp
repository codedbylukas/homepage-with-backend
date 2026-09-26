#include <random>
#include "crow.h"
#include "random-controller.hpp"

int get_random_number(int min, int max) {
    thread_local std::mt19937 gen(std::random_device{}());
    std::uniform_int_distribution<int> distrib(min, max);
    return distrib(gen);
}

void setup_route_random_controller(crow::SimpleApp& app) {
    CROW_ROUTE(app, "/api/cpp/random")([]() {
        int random_number = get_random_number(1, 100);
        
        crow::json::wvalue res;
        res["randomNumber"] = random_number;
        
        return crow::response(200, res);
    });
}

