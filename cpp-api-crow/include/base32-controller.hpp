#pragma once
#include <iostream>
#include <string>
#include <vector>
#include "crow.h"

std::string base32_encode(const std::string& in);
std::string base32_decode(const std::string& in);
void setup_route_base32(crow::SimpleApp& app);
