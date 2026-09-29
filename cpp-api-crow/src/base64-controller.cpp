#include "base64-controller.hpp"
#include <iostream>
#include "crow.h"
#include <string>
#include <vector>
#include <iomanip>
#include <sstream>

const std::string B64_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

std::string base64_encode(const std::string& in) {
    std::string out;
    int val = 0, valb = -6;
    for (unsigned char c : in) {
        val = (val << 8) + c;
        valb += 8;
        while (valb >= 0) {
            out.push_back(B64_CHARS[(val >> valb) & 0x3F]);
            valb -= 6;
        }
    }
    if (valb > -6) out.push_back(B64_CHARS[((val << 8) >> (valb + 8)) & 0x3F]);
    while (out.size() % 4) out.push_back('=');
    return out;
}

std::string base64_decode(const std::string& in) {
    std::string out;
    std::vector<int> T(256, -1);
    for (int i = 0; i < 64; i++) T[B64_CHARS[i]] = i;

    int val = 0, valb = -8;
    for (unsigned char c : in) {
        if (T[c] == -1) break;
        val = (val << 6) + T[c];
        valb += 6;
        if (valb >= 0) {
            out.push_back(char((val >> valb) & 0xFF));
            valb -= 8;
        }
    }
    return out;
}

void setup_route_basesv(crow::SimpleApp& app) {
    CROW_ROUTE(app, "/api/cpp/encode/to-base64/<string>")
    ([](std::string plainText){
        crow::json::wvalue response;
        std::string base64_text = base64_encode(plainText);
        response["conveted"] = base64_text;
        return crow::response(200, response);
    });

    CROW_ROUTE(app, "/api/cpp/encode/from-base64/<string>")
    ([](std::string base64Text){
        crow::json::wvalue response;
        std::string plain_text = base64_decode(base64Text);
        response["converted"] = plain_text;
        return crow::response(200, response);
    });
}
