#include "hex-controller.hpp"
#include <iostream>
#include <string>
#include <vector>
#include <iomanip>
#include <sstream>
#include <cstdint>
#include <cstring>
#include "crow.h"

std::string hex_encode(const std::string& in) {
    std::stringstream ss;
    for (unsigned char c : in) {
        ss << std::hex << std::setw(2) << std::setfill('0') << (int)c;
    }
    return ss.str();
}

std::string hex_decode(const std::string& in) {
    std::string out;
    for (size_t i = 0; i < in.length(); i += 2) {
        std::string byteString = in.substr(i, 2);
        char byte = (char) std::strtol(byteString.c_str(), nullptr, 16);
        out.push_back(byte);
    }
    return out;
}

void setup_route_hex(crow::SimpleApp& app) {
    CROW_ROUTE(app, "/api/cpp/encode/to-hex/<string>")
    ([](std::string plainText){
        crow::json::wvalue response;
        std::string base64_text = hex_encode(plainText);
        response["conveted"] = base64_text;
        return crow::response(200, response);
    });

    CROW_ROUTE(app, "/api/cpp/encode/from-hex/<string>")
    ([](std::string base64Text){
        crow::json::wvalue response;
        std::string plain_text = hex_decode(base64Text);
        response["converted"] = plain_text;
        return crow::response(200, response);
    });
}

