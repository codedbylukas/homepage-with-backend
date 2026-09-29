#include "base85-controller.hpp"
#include <iostream>
#include <string>
#include <vector>
#include <sstream>
#include <iomanip>
#include <algorithm>
#include <map>
#include <cctype>
#include "crow.h"

std::string base85_encode(const std::string& in) {
    std::string out;
    size_t i = 0;
    while (i < in.size()) {
        uint32_t tuple = 0;
        int count = 0;
        for (int j = 0; j < 4; ++j) {
            tuple <<= 8;
            if (i < in.size()) {
                tuple |= static_cast<unsigned char>(in[i++]);
                count++;
            }
        }
        if (count == 0) break;
        if (count < 4) {
            tuple <<= (8 * (4 - count));
        }

        char encoded[5];
        for (int j = 4; j >= 0; --j) {
            encoded[j] = (tuple % 85) + 33;
            tuple /= 85;
        }
        for (int j = 0; j < count + 1; ++j) {
            out.push_back(encoded[j]);
        }
    }
    return out;
}

std::string base85_decode(const std::string& in) {
    std::string out;
    size_t i = 0;
    while (i < in.size()) {
        uint32_t tuple = 0;
        int count = 0;
        for (int j = 0; j < 5; ++j) {
            tuple *= 85;
            if (i < in.size()) {
                tuple += (static_cast<unsigned char>(in[i++]) - 33);
                count++;
            } else {
                tuple += 84;
            }
        }
        if (count == 0) break;
        if (count < 2) break;
        for (int j = 0; j < count - 1; ++j) {
            out.push_back(static_cast<char>((tuple >> ((3 - j) * 8)) & 0xFF));
        }
    }
    return out;
}

void setup_route_base85(crow::SimpleApp& app) {
    CROW_ROUTE(app, "/api/cpp/encode/to-base85/<string>")
    ([](std::string plainText){
        crow::json::wvalue response;
        std::string base64_text = base85_encode(plainText);
        response["conveted"] = base64_text;
        return crow::response(200, response);
    });

    CROW_ROUTE(app, "/api/cpp/encode/from-base85/<string>")
    ([](std::string base64Text){
        crow::json::wvalue response;
        std::string plain_text = base85_decode(base64Text);
        response["converted"] = plain_text;
        return crow::response(200, response);
    });
}
