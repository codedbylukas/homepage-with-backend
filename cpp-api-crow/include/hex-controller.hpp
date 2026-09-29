#pragma once
#include <iostream>
#include <string>
#include <vector>
#include "crow.h"

std::string hex_encode(const std::string& in);
std::string hex_decode(const std::string& in);
void setup_route_hex(crow::SimpleApp& app);

