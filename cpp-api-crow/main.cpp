#include <iostream>
#include <fstream>
#include <mutex>
#include <filesystem>
#include "crow.h"
#include "include/index-controller.hpp"
#include "include/base64-controller.hpp"
#include "include/hex-controller.hpp"
#include "include/rot13-controller.hpp"
#include "include/base32-controller.hpp"
#include "include/base85-controller.hpp"
#include "random-controller.hpp"

class FileLogger : public crow::ILogHandler {
public:
    FileLogger(const std::string& filepath) {
        std::filesystem::path path(filepath);
        if (path.has_parent_path()) {
            std::filesystem::create_directories(path.parent_path());
        }

        log_file_.open(filepath, std::ios::app);
        
        if (!log_file_.is_open()) {
            std::cerr << "[ERROR] konnte Log-Datei nicht oeffnen: " << filepath << std::endl;
        }
    }

    ~FileLogger() {
        if (log_file_.is_open()) {
            log_file_.close();
        }
    }

    void log(const std::string& message, crow::LogLevel /*level*/) override {
        std::lock_guard<std::mutex> lock(mutex_);
        if (log_file_.is_open()) {
            log_file_ << message << std::endl;
            log_file_.flush();
        }
    }

private:
    std::ofstream log_file_;
    std::mutex mutex_;
};

int main() {
    int port = 10000;
    
    FileLogger fileLogger("logs/app_logs.log");
    crow::logger::setHandler(&fileLogger);

    crow::SimpleApp app;
    app.loglevel(crow::LogLevel::Info);
    
    setup_route_index(app);
    setup_route_basesv(app);
    setup_route_hex(app);
    setup_route_rot13(app);
    setup_route_base32(app);
    setup_route_base85(app);
    setup_route_random_controller(app);
    
    std::cout << "Server started on port " << port << std::endl;
    app.port(port).multithreaded().run();

    return 0;
}
