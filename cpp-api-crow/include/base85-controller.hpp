#pragma once
#include <iostream>
#include <string>
#include <vector>
#include "crow.h"

std::string base85_encode(const std::string& in);
std::string base85_decode(const std::string& in);
void setup_route_base85(crow::SimpleApp& app);

