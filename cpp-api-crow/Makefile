# ==========================================
# UNIVERSAL C++ MAKEFILE
# ==========================================

CXX      := g++
CXXFLAGS := -std=c++17 -O3 -march=native -mtune=native -flto=auto -ffast-math -funroll-loops -fomit-frame-pointer -DNDEBUG -Wall -Wextra
LDFLAGS  := -flto=auto -pthread -s
SRC_DIR   := src
INC_DIR   := include
BUILD_DIR := build
TARGET    := app

MAIN_SRC  := main.cpp
SRC_FILES := $(shell find $(SRC_DIR) -name '*.cpp' 2>/dev/null)
ALL_SRCS  := $(MAIN_SRC) $(SRC_FILES)

OBJS := $(MAIN_SRC:%.cpp=$(BUILD_DIR)/%.o) \
        $(SRC_FILES:$(SRC_DIR)/%.cpp=$(BUILD_DIR)/src/%.o)

DEPS := $(OBJS:.o=.d)

IFLAGS := -I$(INC_DIR) -I.

.PHONY: all clean run pgo

all: $(TARGET)

$(TARGET): $(OBJS)
	@echo "==> Linking $(TARGET) with LTO (Max Performance)..."
	@$(CXX) $(OBJS) -o $@ $(LDFLAGS)
	@echo "==> Maximum Performance Build Successful!"

$(BUILD_DIR)/main.o: main.cpp
	@mkdir -p $(BUILD_DIR)
	@echo "==> Compiling $<..."
	@$(CXX) $(CXXFLAGS) $(IFLAGS) -MMD -MP -c $< -o $@

$(BUILD_DIR)/src/%.o: $(SRC_DIR)/%.cpp
	@mkdir -p $(dir $@)
	@echo "==> Compiling $<..."
	@$(CXX) $(CXXFLAGS) $(IFLAGS) -MMD -MP -c $< -o $@

-include $(DEPS)

pgo:
	@echo "==> [PGO Step 1/3] Building instrumented binary..."
	@$(MAKE) clean
	@$(MAKE) CXXFLAGS="$(CXXFLAGS) -fprofile-generate" LDFLAGS="$(LDFLAGS) -fprofile-generate" all
	@echo "==> [PGO Step 2/3] Running program to collect execution profile..."
	@./$(TARGET) || true
	@echo "==> [PGO Step 3/3] Rebuilding with execution profile data..."
	@$(MAKE) clean
	@$(MAKE) CXXFLAGS="$(CXXFLAGS) -fprofile-use -fprofile-correction" LDFLAGS="$(LDFLAGS) -fprofile-use" all
	@echo "==> [PGO Complete] Absolute maximum performance binary created!"

run: all
	@./$(TARGET)

clean:
	@echo "==> Cleaning up..."
	@rm -rf $(BUILD_DIR) $(TARGET) *.gcda *.gcno
