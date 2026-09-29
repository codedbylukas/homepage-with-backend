#pragma once
#include <iostream>
#include <string>
#include <vector>
#include "crow.h"

std::string rot13(const std::string& in);
void setup_route_rot13(crow::SimpleApp& app);
