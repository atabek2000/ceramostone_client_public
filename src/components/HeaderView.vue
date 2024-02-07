<template>
  <div class="container" style="margin-bottom: 20px">
    <div class="header-block">
      <div class="header-left-block">
        <nav role="navigation">
          <div id="menuToggle">
            <MenuOutlined @click="showMenu" />
          </div>
        </nav>
        <div class="spacer"></div>

        <div class="header-links-block">
          <p href="https://ceramostone.kz/" class="header-button">
            <a href="https://ceramostone.kz/" target="_blank">{{
              $t("button.store")
            }}</a>
          </p>
          <p class="header-button">{{ $t("button.howWork") }}</p>
        </div>
        <div class="header-icons-block">
          <a-dropdown :trigger="['click']">
            <a class="ant-dropdown-link" @click.prevent>
              <div class="d-flex header-button">
                <div class="header-icon">
                  {{ getLocalLang() ? getLocalLang().toUpperCase() : "RU" }}
                </div>
              </div>
            </a>
            <template #overlay>
              <a-menu @click="clickLang">
                <!-- <a-menu-item key="en">EN</a-menu-item> -->
                <a-menu-item key="ru">RU</a-menu-item>
                <!-- <a-menu-item key="kz">KZ</a-menu-item> -->
                <a-menu-item key="cn">CN</a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
          <div class="header-icon header-button">
            <a-badge
              :count="$store.state.noticeCount"
              :overflow-count="10"
              @click="showDrawerNotice"
            >
              <a-avatar
                shape="circle"
                size="large"
                style="background-color: #181734"
              >
                <template #icon><BellOutlined /></template>
              </a-avatar>
            </a-badge>
          </div>
          <a-dropdown :trigger="['click']">
            <a class="ant-dropdown-link" @click.prevent>
              <div class="d-flex header-button">
                <div class="header-icon">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 30 30"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M15 0C6.72927 0 0 6.72927 0 15C0 23.2707 6.72927 30 15 30C23.2707 30 30 23.2707 30 15C30 6.72927 23.2707 0 15 0ZM15 2.30769C22.0222 2.30769 27.6923 7.97777 27.6923 15C27.6923 22.0222 22.0222 27.6923 15 27.6923C7.97777 27.6923 2.30769 22.0222 2.30769 15C2.30769 7.97777 7.97777 2.30769 15 2.30769ZM15 5.76923C11.8269 5.76923 9.23077 8.36538 9.23077 11.5385C9.23077 13.2873 10.0466 14.8422 11.2861 15.9014C8.6899 17.2491 6.92308 19.9624 6.92308 23.0769H9.23077C9.23077 19.8768 11.7999 17.3077 15 17.3077C18.2001 17.3077 20.7692 19.8768 20.7692 23.0769H23.0769C23.0769 19.9624 21.3101 17.2491 18.7139 15.9014C19.9534 14.8422 20.7692 13.2873 20.7692 11.5385C20.7692 8.36538 18.1731 5.76923 15 5.76923ZM15 8.07692C16.9246 8.07692 18.4615 9.61388 18.4615 11.5385C18.4615 13.463 16.9246 15 15 15C13.0754 15 11.5385 13.463 11.5385 11.5385C11.5385 9.61388 13.0754 8.07692 15 8.07692Z"
                      fill="white"
                    />
                  </svg>
                </div>
              </div>
            </a>
            <template #overlay>
              <a-menu @click="clickCabinet">
                <a-menu-item key="1">{{ $t("button.logout") }}</a-menu-item>
                <a-menu-item key="2">{{ $t("button.settings") }}</a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
      </div>
      <NoticesView
        :visible="visible"
        @onClose="onCloseNotice"
        @onDelete="onDeleteNotice"
      />

      <HeaderLeft :visible="burger_check" @onClose="onCloseMenu" />
    </div>
  </div>
  <!-- <svg class="Christmas_Lights">
    <path
      class="light_cord"
      d="M-673.8-29.1c17.3 23.7 38.1 34.3 63.6 48.8 45.4 25.7 93.4 39.1 145.4 44.4 58 6 112.1 6.2 164-9 64.2-18.8 113.7-51 113.7-51 13.3 17.3 28.1 25.3 50.1 34.5 20.3 8.5 43.8 17 66.1 23 30.1 8.1 67.1 8.4 99.1 8.3 66.5-0.1 134-3.3 197.4-17.8 30.3-6.9 76-24 89.3-32 9.3 4.7 22.4 16.1 34.7 22.8 34 18.6 73.2 33.8 111 42.8 46.1 11 93.6 5.6 137-12.8 14.4-6.1 56.6-26.1 65.7-38.5 8.8 15.1 102.8 33.1 151.5 32.5 68.4-0.8 142.2-10.5 196.7-55.9 9.7 11.9 28.3 20 42.5 25.2 35.5 12.9 76.3 22 113.9 24.9 50.2 3.9 100.3 3.9 150.1-5.3 25.6-4.7 50.6-14.2 74.4-24.8 6.7-3 36.4-14.8 43.1-20.1"
    />
    <path
      class="red_bulb bulb blink-1"
      d="M1351.5 76.9c-1.5-3.3-0.6-11-0.6-11 0-2.2-1.2-4-3.4-4h-7.1c-2.2 0-3.4 1.8-3.4 4 0 0 0.7 7.5-0.6 11 -1.2 3.5-6.2 7.8-6.2 13.4 0 8.9 6.2 16.1 13.7 16.1 7.6 0 13.7-7.2 13.7-16.1C1357.7 84.7 1353 80.2 1351.5 76.9z"
    />
    <path
      class="light_fixture"
      d="M1351.9 71.4c0 0.5-0.4 1-1 1h-14.1c-0.5 0-1-0.5-1-1l0.5-14.9c0-0.5 0.5-1 1-1h12.9c0.5 0 1 0.5 1 1L1351.9 71.4z"
    />
    <path
      class="light_fixture"
      d="M1343.1 57.9c-0.5-0.2-0.7-0.8-0.5-1.3l0 0c0.2-0.5 0.3-0.9 0.3-1.3l0 0c0-1.5-1.4-2.7-2.2-3.6l0 0c-0.5-0.6-0.7-1.5-0.8-2.4l0 0c-0.1-1.5 1-3.4 3.3-3.6l0 0 0.1 0 0.1 0c1.2 0 2.2 0.3 2.9 1l0 0c0.7 0.6 1 1.5 1 2.3l0 0c0 1.3-0.6 2.4-1.2 3.4l0 0c-0.4 0.6-0.9 1.1-1.4 1.5l0 0c0.2 0.5 0.3 1 0.3 1.5l0 0c0 0.6-0.1 1.3-0.4 2.1l0 0h0c-0.2 0.4-0.5 0.6-0.9 0.6l0 0C1343.4 58 1343.2 57.9 1343.1 57.9L1343.1 57.9zM1341.8 49.3c0 0.5 0.2 1.1 0.3 1.2l0 0c0.2 0.3 0.8 0.8 1.4 1.6l0 0c0.2-0.2 0.5-0.5 0.8-0.9l0 0c0.5-0.7 0.9-1.7 0.9-2.3l0 0c-0.1-0.7 0-1-1.9-1.2l0 0C1342 47.9 1341.9 48.5 1341.8 49.3L1341.8 49.3z"
    />
    <path
      class="green_bulb blink-2 bulb"
      d="M1265.6 90.3c-1.5-3.3-0.6-11-0.6-11 0-2.2-1.2-4-3.4-4h-7.1c-2.2 0-3.4 1.8-3.4 4 0 0 0.7 7.5-0.6 11 -1.2 3.5-6.2 7.8-6.2 13.4 0 8.9 6.2 16.1 13.7 16.1 7.6 0 13.7-7.2 13.7-16.1C1271.8 98.1 1267.2 93.6 1265.6 90.3z"
    />
    <path
      class="light_fixture"
      d="M1266 84.8c0 0.5-0.4 1-1 1H1251c-0.5 0-1-0.5-1-1l0.5-14.9c0-0.5 0.5-1 1-1h12.9c0.5 0 1 0.5 1 1L1266 84.8z"
    />
    <path
      class="light_fixture"
      d="M1257.2 71.2c-0.5-0.2-0.7-0.8-0.5-1.3l0 0c0.2-0.5 0.3-0.9 0.3-1.3l0 0c0-1.5-1.4-2.7-2.2-3.6l0 0c-0.5-0.6-0.7-1.5-0.8-2.4l0 0c-0.1-1.5 1-3.4 3.3-3.6l0 0 0.1 0 0.1 0c1.2 0 2.2 0.3 2.9 1l0 0c0.7 0.6 1 1.5 1 2.3l0 0c0 1.3-0.6 2.4-1.2 3.4l0 0c-0.4 0.6-0.9 1.1-1.4 1.5l0 0c0.2 0.5 0.3 1 0.3 1.5l0 0c0 0.6-0.1 1.3-0.4 2.1l0 0h0c-0.2 0.4-0.5 0.6-0.9 0.6l0 0C1257.5 71.3 1257.4 71.3 1257.2 71.2L1257.2 71.2zM1256 62.6c0 0.5 0.2 1.1 0.3 1.2l0 0c0.2 0.3 0.8 0.8 1.4 1.6l0 0c0.2-0.2 0.5-0.5 0.8-0.9l0 0c0.5-0.7 0.9-1.7 0.9-2.3l0 0c-0.1-0.7 0-1-1.9-1.2l0 0C1256.1 61.3 1256.1 61.8 1256 62.6L1256 62.6z"
    />
    <path
      class="blue_bulb blink-3 bulb"
      d="M1179.7 90.3c-1.5-3.3-0.6-11-0.6-11 0-2.2-1.2-4-3.4-4h-7.1c-2.2 0-3.4 1.8-3.4 4 0 0 0.7 7.5-0.6 11 -1.2 3.5-6.2 7.8-6.2 13.4 0 8.9 6.2 16.1 13.7 16.1 7.6 0 13.7-7.2 13.7-16.1C1185.9 98.1 1181.3 93.6 1179.7 90.3z"
    />
    <path
      class="light_fixture"
      d="M1180.2 84.8c0 0.5-0.4 1-1 1h-14.1c-0.5 0-1-0.5-1-1l0.5-14.9c0-0.5 0.5-1 1-1h12.9c0.5 0 1 0.5 1 1L1180.2 84.8z"
    />
    <path
      class="light_fixture"
      d="M1171.3 71.2c-0.5-0.2-0.7-0.8-0.5-1.3l0 0c0.2-0.5 0.3-0.9 0.3-1.3l0 0c0-1.5-1.4-2.7-2.2-3.6l0 0c-0.5-0.6-0.7-1.5-0.8-2.4l0 0c-0.1-1.5 1-3.4 3.3-3.6l0 0 0.1 0 0.1 0c1.2 0 2.2 0.3 2.9 1l0 0c0.7 0.6 1 1.5 1 2.3l0 0c0 1.3-0.6 2.4-1.2 3.4l0 0c-0.4 0.6-0.9 1.1-1.4 1.5l0 0c0.2 0.5 0.3 1 0.3 1.5l0 0c0 0.6-0.1 1.3-0.4 2.1l0 0h0c-0.2 0.4-0.5 0.6-0.9 0.6l0 0C1171.6 71.3 1171.5 71.3 1171.3 71.2L1171.3 71.2zM1170.1 62.6c0 0.5 0.2 1.1 0.3 1.2l0 0c0.2 0.3 0.8 0.8 1.4 1.6l0 0c0.2-0.2 0.5-0.5 0.8-0.9l0 0c0.5-0.7 0.9-1.7 0.9-2.3l0 0c-0.1-0.7 0-1-1.9-1.2l0 0C1170.3 61.3 1170.2 61.8 1170.1 62.6L1170.1 62.6z"
    />
    <path
      class="red_bulb blink-4 bulb"
      d="M1093.9 73.8c-1.5-3.3-0.6-11-0.6-11 0-2.2-1.2-4-3.4-4h-7.1c-2.2 0-3.4 1.8-3.4 4 0 0 0.7 7.5-0.6 11 -1.2 3.5-6.2 7.8-6.2 13.4 0 8.9 6.2 16.1 13.7 16.1 7.6 0 13.7-7.2 13.7-16.1C1100 81.6 1095.4 77 1093.9 73.8z"
    />
    <path
      class="light_fixture"
      d="M1094.3 68.3c0 0.5-0.4 1-1 1h-14.1c-0.5 0-1-0.5-1-1l0.5-14.9c0-0.5 0.5-1 1-1h12.9c0.5 0 1 0.4 1 1L1094.3 68.3z"
    />
    <path
      class="light_fixture"
      d="M1085.5 54.7c-0.5-0.2-0.7-0.8-0.5-1.3l0 0c0.2-0.5 0.3-0.9 0.3-1.3l0 0c0-1.5-1.4-2.7-2.2-3.6l0 0c-0.5-0.6-0.7-1.5-0.8-2.4l0 0c-0.1-1.5 1-3.4 3.3-3.6l0 0 0.1 0 0.1 0c1.2 0 2.2 0.3 2.9 1l0 0c0.7 0.6 1 1.5 1 2.3l0 0c0 1.3-0.6 2.4-1.2 3.4l0 0c-0.4 0.6-0.9 1.1-1.4 1.5l0 0c0.2 0.5 0.3 1 0.3 1.5l0 0c0 0.6-0.1 1.3-0.4 2.1l0 0h0c-0.2 0.4-0.5 0.6-0.9 0.6l0 0C1085.7 54.8 1085.6 54.8 1085.5 54.7L1085.5 54.7zM1084.2 46.1c0 0.5 0.2 1.1 0.3 1.2l0 0c0.2 0.3 0.8 0.8 1.4 1.6l0 0c0.2-0.2 0.5-0.5 0.8-0.9l0 0c0.5-0.7 0.9-1.7 0.9-2.3l0 0c-0.1-0.7 0-1-1.9-1.2l0 0C1084.4 44.7 1084.3 45.3 1084.2 46.1L1084.2 46.1z"
    />
    <path
      class="green_bulb blink-5 bulb"
      d="M1019 39.8c-1.5-3.3-0.6-11-0.6-11 0-2.2-1.2-4-3.4-4h-7.1c-2.2 0-3.4 1.8-3.4 4 0 0 0.7 7.5-0.6 11 -1.2 3.5-6.2 7.8-6.2 13.4 0 8.9 6.2 16.1 13.7 16.1 7.6 0 13.7-7.2 13.7-16.1C1025.1 47.6 1020.5 43.1 1019 39.8z"
    />
    <path
      class="light_fixture"
      d="M1019.4 34.3c0 0.5-0.4 1-1 1h-14.1c-0.5 0-1-0.4-1-1l0.5-14.9c0-0.5 0.5-1 1-1h12.9c0.5 0 1 0.4 1 1L1019.4 34.3z"
    />
    <path
      class="light_fixture"
      d="M1010.6 20.8c-0.5-0.2-0.7-0.8-0.5-1.3l0 0c0.2-0.5 0.3-0.9 0.3-1.3l0 0c0-1.5-1.4-2.7-2.2-3.6l0 0c-0.5-0.6-0.7-1.5-0.8-2.4l0 0c-0.1-1.5 1-3.4 3.3-3.6l0 0 0.1 0 0.1 0c1.2 0 2.2 0.3 2.9 1l0 0c0.7 0.6 1 1.5 1 2.3l0 0c0 1.3-0.6 2.4-1.2 3.4l0 0c-0.4 0.6-0.9 1.1-1.4 1.5l0 0c0.2 0.5 0.3 1 0.3 1.5l0 0c0 0.6-0.1 1.3-0.4 2.1l0 0h0c-0.2 0.4-0.5 0.6-0.9 0.6l0 0C1010.8 20.8 1010.7 20.8 1010.6 20.8L1010.6 20.8zM1009.3 12.2c0 0.5 0.2 1.1 0.3 1.2l0 0c0.2 0.3 0.8 0.8 1.4 1.6l0 0c0.2-0.2 0.5-0.5 0.8-0.9l0 0c0.5-0.7 0.9-1.7 0.9-2.3l0 0c-0.1-0.7 0-1-1.9-1.2l0 0C1009.5 10.8 1009.4 11.3 1009.3 12.2L1009.3 12.2z"
    />
    <path
      class="white_bulb blink-6 bulb"
      d="M928.5 83.2c-1.5-3.3-0.6-11-0.6-11 0-2.2-1.2-4-3.4-4h-7.1c-2.2 0-3.4 1.8-3.4 4 0 0 0.7 7.5-0.6 11 -1.2 3.5-6.2 7.8-6.2 13.4 0 8.9 6.2 16.1 13.7 16.1 7.6 0 13.7-7.2 13.7-16.1C934.7 91 930.1 86.4 928.5 83.2z"
    />
    <path
      class="light_fixture"
      d="M928.9 77.6c0 0.5-0.4 1-1 1h-14.1c-0.5 0-1-0.5-1-1l0.5-14.9c0-0.5 0.5-1 1-1h12.9c0.5 0 1 0.5 1 1L928.9 77.6z"
    />
    <path
      class="light_fixture"
      d="M920.1 64.1c-0.5-0.2-0.7-0.8-0.5-1.3l0 0c0.2-0.5 0.3-0.9 0.3-1.3l0 0c0-1.5-1.4-2.7-2.2-3.6l0 0c-0.5-0.6-0.7-1.5-0.8-2.4l0 0c-0.1-1.5 1-3.4 3.3-3.6l0 0 0.1 0 0.1 0c1.2 0 2.2 0.3 2.9 1l0 0c0.7 0.6 1 1.5 1 2.3l0 0c0 1.3-0.6 2.4-1.2 3.4l0 0c-0.4 0.6-0.9 1.1-1.4 1.5l0 0c0.2 0.5 0.3 1 0.3 1.5l0 0c0 0.6-0.1 1.3-0.4 2.1l0 0h0c-0.2 0.4-0.5 0.6-0.9 0.6l0 0C920.4 64.2 920.2 64.1 920.1 64.1L920.1 64.1zM918.9 55.5c0 0.5 0.2 1.1 0.3 1.2l0 0c0.2 0.3 0.8 0.8 1.4 1.6l0 0c0.2-0.2 0.5-0.5 0.8-0.9l0 0c0.5-0.7 0.9-1.7 0.9-2.3l0 0c-0.1-0.7 0-1-1.9-1.2l0 0C919 54.1 918.9 54.7 918.9 55.5L918.9 55.5z"
    />
    <path
      class="blue_bulb blink-7 bulb"
      d="M836.2 93.3c-1.5-3.3-0.6-11-0.6-11 0-2.2-1.2-4-3.4-4h-7.1c-2.2 0-3.4 1.8-3.4 4 0 0 0.7 7.5-0.6 11 -1.2 3.5-6.2 7.8-6.2 13.4 0 8.9 6.2 16.1 13.7 16.1 7.6 0 13.7-7.2 13.7-16.1C842.4 101.1 837.8 96.5 836.2 93.3z"
    />
    <path
      class="light_fixture"
      d="M836.6 87.7c0 0.5-0.4 1-1 1h-14.1c-0.5 0-1-0.5-1-1l0.5-14.9c0-0.5 0.5-1 1-1h12.9c0.5 0 1 0.5 1 1L836.6 87.7z"
    />
    <path
      class="light_fixture"
      d="M827.8 74.2c-0.5-0.2-0.7-0.8-0.5-1.3l0 0c0.2-0.5 0.3-0.9 0.3-1.3l0 0c0-1.5-1.4-2.7-2.2-3.6l0 0c-0.5-0.6-0.7-1.5-0.8-2.4l0 0c-0.1-1.5 1-3.4 3.3-3.6l0 0 0.1 0 0.1 0c1.2 0 2.2 0.3 2.9 1l0 0c0.7 0.6 1 1.5 1 2.3l0 0c0 1.3-0.6 2.4-1.2 3.4l0 0c-0.4 0.6-0.9 1.1-1.4 1.5l0 0c0.2 0.5 0.3 1 0.3 1.5l0 0c0 0.6-0.1 1.3-0.4 2.1l0 0h0c-0.2 0.4-0.5 0.6-0.9 0.6l0 0C828.1 74.3 828 74.2 827.8 74.2L827.8 74.2zM826.6 65.6c0 0.5 0.2 1.1 0.3 1.2l0 0c0.2 0.3 0.8 0.8 1.4 1.6l0 0c0.2-0.2 0.5-0.5 0.8-0.9l0 0c0.5-0.7 0.9-1.7 0.9-2.3l0 0c-0.1-0.7 0-1-1.9-1.2l0 0C826.8 64.2 826.7 64.8 826.6 65.6L826.6 65.6z"
    />
    <path
      class="red_bulb blink-1 bulb"
      d="M750.3 88.6c-1.5-3.3-0.6-11-0.6-11 0-2.2-1.2-4-3.4-4h-7.1c-2.2 0-3.4 1.8-3.4 4 0 0 0.7 7.5-0.6 11 -1.2 3.5-6.2 7.8-6.2 13.4 0 8.9 6.2 16.1 13.7 16.1 7.6 0 13.7-7.2 13.7-16.1C756.5 96.4 751.9 91.9 750.3 88.6z"
    />
    <path
      class="light_fixture"
      d="M750.8 83.1c0 0.5-0.4 1-1 1h-14.1c-0.5 0-1-0.5-1-1l0.5-14.9c0-0.5 0.5-1 1-1h12.9c0.5 0 1 0.5 1 1L750.8 83.1z"
    />
    <path
      class="light_fixture"
      d="M742 69.5c-0.5-0.2-0.7-0.8-0.5-1.3l0 0c0.2-0.5 0.3-0.9 0.3-1.3l0 0c0-1.5-1.4-2.7-2.2-3.6l0 0c-0.5-0.6-0.7-1.5-0.8-2.4l0 0c-0.1-1.5 1-3.4 3.3-3.6l0 0 0.1 0 0.1 0c1.2 0 2.2 0.3 2.9 1l0 0c0.7 0.6 1 1.5 1 2.3l0 0c0 1.3-0.6 2.4-1.2 3.4l0 0c-0.4 0.6-0.9 1.1-1.4 1.5l0 0c0.2 0.5 0.3 1 0.3 1.5l0 0c0 0.6-0.1 1.3-0.4 2.1l0 0h0c-0.2 0.4-0.5 0.6-0.9 0.6l0 0C742.2 69.6 742.1 69.6 742 69.5L742 69.5zM740.7 60.9c0 0.5 0.2 1.1 0.3 1.2l0 0c0.2 0.3 0.8 0.8 1.4 1.6l0 0c0.2-0.2 0.5-0.5 0.8-0.9l0 0c0.5-0.7 0.9-1.6 0.9-2.3l0 0c-0.1-0.7 0-1-1.9-1.2l0 0C740.9 59.6 740.8 60.1 740.7 60.9L740.7 60.9z"
    />
    <path
      class="gold_bulb bulb blink-9"
      d="M671.1 63.3c-1.5-3.3-0.6-11-0.6-11 0-2.2-1.2-4-3.4-4H660c-2.2 0-3.4 1.8-3.4 4 0 0 0.7 7.5-0.6 11 -1.2 3.5-6.2 7.8-6.2 13.4 0 8.9 6.2 16.1 13.7 16.1 7.6 0 13.7-7.2 13.7-16.1C677.3 71.1 672.7 66.6 671.1 63.3z"
    />
    <path
      class="light_fixture"
      d="M671.6 57.8c0 0.5-0.4 1-1 1h-14.1c-0.5 0-1-0.5-1-1l0.5-14.9c0-0.5 0.5-1 1-1H670c0.5 0 1 0.4 1 1L671.6 57.8z"
    />
    <path
      class="light_fixture"
      d="M662.7 44.3c-0.5-0.2-0.7-0.8-0.5-1.3l0 0c0.2-0.5 0.3-0.9 0.3-1.3l0 0c0-1.5-1.4-2.7-2.2-3.6l0 0c-0.5-0.6-0.7-1.5-0.8-2.4l0 0c-0.1-1.5 1-3.4 3.3-3.6l0 0 0.1 0 0.1 0c1.2 0 2.2 0.3 2.9 1l0 0c0.7 0.6 1 1.5 1 2.3l0 0c0 1.3-0.6 2.4-1.2 3.4l0 0c-0.4 0.6-0.9 1.1-1.4 1.5l0 0c0.2 0.5 0.3 1 0.3 1.5l0 0c0 0.6-0.1 1.3-0.4 2.1l0 0h0c-0.2 0.4-0.5 0.6-0.9 0.6l0 0C663 44.3 662.9 44.3 662.7 44.3L662.7 44.3zM661.5 35.7c0 0.5 0.2 1.1 0.3 1.2l0 0c0.2 0.3 0.8 0.8 1.4 1.6l0 0c0.2-0.2 0.5-0.5 0.8-0.9l0 0c0.5-0.7 0.9-1.7 0.9-2.3l0 0c-0.1-0.7 0-1-1.9-1.2l0 0C661.7 34.3 661.6 34.8 661.5 35.7L661.5 35.7z"
    />
    <path
      class="green_bulb blink-10 bulb"
      d="M591.3 105.9c-1.5-3.3-0.6-11-0.6-11 0-2.2-1.2-4-3.4-4h-7.1c-2.2 0-3.4 1.8-3.4 4 0 0 0.7 7.5-0.6 11 -1.2 3.5-6.2 7.8-6.2 13.4 0 8.9 6.2 16.1 13.7 16.1 7.6 0 13.7-7.2 13.7-16.1C597.4 113.7 592.8 109.2 591.3 105.9z"
    />
    <path
      class="light_fixture"
      d="M591.7 100.4c0 0.5-0.4 1-1 1h-14.1c-0.5 0-1-0.5-1-1l0.5-14.9c0-0.5 0.5-1 1-1h12.9c0.5 0 1 0.5 1 1L591.7 100.4z"
    />
    <path
      class="light_fixture"
      d="M582.9 86.8c-0.5-0.2-0.7-0.8-0.5-1.3l0 0c0.2-0.5 0.3-0.9 0.3-1.3l0 0c0-1.5-1.4-2.7-2.2-3.6l0 0c-0.5-0.6-0.7-1.5-0.8-2.4l0 0c-0.1-1.5 1-3.4 3.3-3.6l0 0 0.1 0 0.1 0c1.2 0 2.2 0.3 2.9 1l0 0c0.7 0.6 1 1.5 1 2.3l0 0c0 1.3-0.6 2.4-1.2 3.4l0 0c-0.4 0.6-0.9 1.1-1.4 1.5l0 0c0.2 0.5 0.3 1 0.3 1.5l0 0c0 0.6-0.1 1.3-0.4 2.1l0 0h0c-0.2 0.4-0.5 0.6-0.9 0.6l0 0C583.1 86.9 583 86.9 582.9 86.8L582.9 86.8zM581.6 78.2c0 0.5 0.2 1.1 0.3 1.2l0 0c0.2 0.3 0.8 0.8 1.4 1.6l0 0c0.2-0.2 0.5-0.5 0.8-0.9l0 0c0.5-0.7 0.9-1.7 0.9-2.3l0 0c-0.1-0.7 0-1-1.9-1.2l0 0C581.8 76.8 581.7 77.4 581.6 78.2L581.6 78.2z"
    />
    <path
      class="blue_bulb blink-1 bulb"
      d="M492.7 103.6c-1.5-3.3-0.6-11-0.6-11 0-2.2-1.2-4-3.4-4h-7.1c-2.2 0-3.4 1.8-3.4 4 0 0 0.7 7.5-0.6 11 -1.2 3.5-6.2 7.8-6.2 13.4 0 8.9 6.2 16.1 13.7 16.1 7.6 0 13.7-7.2 13.7-16.1C498.9 111.4 494.3 106.9 492.7 103.6z"
    />
    <path
      class="light_fixture"
      d="M493.1 98.1c0 0.5-0.4 1-1 1h-14.1c-0.5 0-1-0.5-1-1l0.5-14.9c0-0.5 0.5-1 1-1h12.9c0.5 0 1 0.5 1 1L493.1 98.1z"
    />
    <path
      class="light_fixture"
      d="M484.3 84.5c-0.5-0.2-0.7-0.8-0.5-1.3l0 0c0.2-0.5 0.3-0.9 0.3-1.3l0 0c0-1.5-1.4-2.7-2.2-3.6l0 0c-0.5-0.6-0.7-1.5-0.8-2.4l0 0c-0.1-1.5 1-3.4 3.3-3.6l0 0 0.1 0 0.1 0c1.2 0 2.2 0.3 2.9 1l0 0c0.7 0.6 1 1.5 1 2.3l0 0c0 1.3-0.6 2.4-1.2 3.4l0 0c-0.4 0.6-0.9 1.1-1.4 1.5l0 0c0.2 0.5 0.3 1 0.3 1.5l0 0c0 0.6-0.1 1.3-0.4 2.1l0 0h0c-0.2 0.4-0.5 0.6-0.9 0.6l0 0C484.6 84.6 484.4 84.6 484.3 84.5L484.3 84.5zM483.1 75.9c0 0.5 0.2 1.1 0.3 1.2l0 0c0.2 0.3 0.8 0.8 1.4 1.6l0 0c0.2-0.2 0.5-0.5 0.8-0.9l0 0c0.5-0.7 0.9-1.7 0.9-2.3l0 0c-0.1-0.7 0-1-1.9-1.2l0 0C483.2 74.5 483.1 75.1 483.1 75.9L483.1 75.9z"
    />
    <path
      class="red_bulb blink-2 bulb"
      d="M406.8 93.3c-1.5-3.3-0.6-11-0.6-11 0-2.2-1.2-4-3.4-4h-7.1c-2.2 0-3.4 1.8-3.4 4 0 0 0.7 7.5-0.6 11 -1.2 3.5-6.2 7.8-6.2 13.4 0 8.9 6.2 16.1 13.7 16.1 7.6 0 13.7-7.2 13.7-16.1C413 101.1 408.4 96.6 406.8 93.3z"
    />
    <path
      class="light_fixture"
      d="M407.3 87.8c0 0.5-0.4 1-1 1h-14.1c-0.5 0-1-0.5-1-1l0.5-14.9c0-0.5 0.5-1 1-1h12.9c0.5 0 1 0.5 1 1L407.3 87.8z"
    />
    <path
      class="light_fixture"
      d="M398.4 74.3c-0.5-0.2-0.7-0.8-0.5-1.3l0 0c0.2-0.5 0.3-0.9 0.3-1.3l0 0c0-1.5-1.4-2.7-2.2-3.6l0 0c-0.5-0.6-0.7-1.5-0.8-2.4l0 0c-0.1-1.5 1-3.4 3.3-3.6l0 0 0.1 0 0.1 0c1.2 0 2.2 0.3 2.9 1l0 0c0.7 0.6 1 1.5 1 2.3l0 0c0 1.3-0.6 2.4-1.2 3.4l0 0c-0.4 0.6-0.9 1.1-1.4 1.5l0 0c0.2 0.5 0.3 1 0.3 1.5l0 0c0 0.6-0.1 1.3-0.4 2.1l0 0h0c-0.2 0.4-0.5 0.6-0.9 0.6l0 0C398.7 74.3 398.6 74.3 398.4 74.3L398.4 74.3zM397.2 65.7c0 0.5 0.2 1.1 0.3 1.2l0 0c0.2 0.2 0.8 0.8 1.4 1.6l0 0c0.2-0.2 0.5-0.5 0.8-0.9l0 0c0.5-0.7 0.9-1.7 0.9-2.3l0 0c-0.1-0.7 0-1-1.9-1.2l0 0C397.4 64.3 397.3 64.9 397.2 65.7L397.2 65.7z"
    />
    <path
      class="white_bulb blink-3 bulb"
      d="M318.3 50c-1.5-3.3-0.6-11-0.6-11 0-2.2-1.2-4-3.4-4h-7.1c-2.2 0-3.4 1.8-3.4 4 0 0 0.7 7.5-0.6 11 -1.2 3.5-6.2 7.8-6.2 13.4 0 8.9 6.2 16.1 13.7 16.1 7.6 0 13.7-7.2 13.7-16.1C324.5 57.8 319.9 53.3 318.3 50z"
    />
    <path
      class="light_fixture"
      d="M318.8 44.5c0 0.5-0.4 1-1 1h-14.1c-0.5 0-1-0.4-1-1l0.5-14.9c0-0.5 0.5-1 1-1h12.9c0.5 0 1 0.4 1 1L318.8 44.5z"
    />
    <path
      class="light_fixture"
      d="M310 30.9c-0.5-0.2-0.7-0.8-0.5-1.3l0 0c0.2-0.5 0.3-0.9 0.3-1.3l0 0c0-1.5-1.4-2.7-2.2-3.6l0 0c-0.5-0.6-0.7-1.5-0.8-2.4l0 0c-0.1-1.5 1-3.4 3.3-3.6l0 0 0.1 0 0.1 0c1.2 0 2.2 0.3 2.9 1l0 0c0.7 0.6 1 1.5 1 2.3l0 0c0 1.3-0.6 2.4-1.2 3.4l0 0c-0.4 0.6-0.9 1.1-1.4 1.5l0 0c0.2 0.5 0.3 1 0.3 1.5l0 0c0 0.6-0.1 1.3-0.4 2.1l0 0h0c-0.2 0.4-0.5 0.6-0.9 0.6l0 0C310.2 31 310.1 31 310 30.9L310 30.9zM308.7 22.3c0 0.5 0.2 1.1 0.3 1.2l0 0c0.2 0.3 0.8 0.8 1.4 1.6l0 0c0.2-0.2 0.5-0.5 0.8-0.9l0 0c0.5-0.7 0.9-1.7 0.9-2.3l0 0c-0.1-0.7 0-1-1.9-1.2l0 0C308.9 21 308.8 21.5 308.7 22.3L308.7 22.3z"
    />
    <path
      class="green_bulb blink-4 bulb"
      d="M232.5 80.9c-1.5-3.3-0.6-11-0.6-11 0-2.2-1.2-4-3.4-4h-7.1c-2.2 0-3.4 1.8-3.4 4 0 0 0.7 7.5-0.6 11 -1.2 3.5-6.2 7.8-6.2 13.4 0 8.9 6.2 16.1 13.7 16.1 7.6 0 13.7-7.2 13.7-16.1C238.6 88.7 234 84.2 232.5 80.9z"
    />
    <path
      class="light_fixture"
      d="M232.9 75.4c0 0.5-0.4 1-1 1h-14.1c-0.5 0-1-0.5-1-1l0.5-14.9c0-0.5 0.5-1 1-1h12.9c0.5 0 1 0.5 1 1L232.9 75.4z"
    />
    <path
      class="light_fixture"
      d="M224.1 61.8c-0.5-0.2-0.7-0.8-0.5-1.3l0 0c0.2-0.5 0.3-0.9 0.3-1.3l0 0c0-1.5-1.4-2.7-2.2-3.6l0 0c-0.5-0.6-0.7-1.5-0.8-2.4l0 0c-0.1-1.5 1-3.4 3.3-3.6l0 0 0.1 0 0.1 0c1.2 0 2.2 0.3 2.9 1l0 0c0.7 0.6 1 1.5 1 2.3l0 0c0 1.3-0.6 2.4-1.2 3.4l0 0c-0.4 0.6-0.9 1.1-1.4 1.5l0 0c0.2 0.5 0.3 1 0.3 1.5l0 0c0 0.6-0.1 1.3-0.4 2.1l0 0h0c-0.2 0.4-0.5 0.6-0.9 0.6l0 0C224.3 61.9 224.2 61.9 224.1 61.8L224.1 61.8zM222.8 53.2c0 0.5 0.2 1.1 0.3 1.2l0 0c0.2 0.3 0.8 0.8 1.4 1.6l0 0c0.2-0.2 0.5-0.5 0.8-0.9l0 0c0.5-0.7 0.9-1.6 0.9-2.3l0 0c-0.1-0.7 0-1-1.9-1.2l0 0C223 51.9 222.9 52.4 222.8 53.2L222.8 53.2z"
    />
    <path
      class="blue_bulb blink-5 bulb"
      d="M148.8 92.3c-1.5-3.3-0.6-11-0.6-11 0-2.2-1.2-4-3.4-4h-7.1c-2.2 0-3.4 1.8-3.4 4 0 0 0.7 7.5-0.6 11 -1.2 3.5-6.2 7.8-6.2 13.4 0 8.9 6.2 16.1 13.7 16.1s13.7-7.2 13.7-16.1C155 100.1 150.4 95.6 148.8 92.3z"
    />
    <path
      class="light_fixture"
      d="M149.3 86.8c0 0.5-0.4 1-1 1h-14.1c-0.5 0-1-0.5-1-1l0.5-14.9c0-0.5 0.5-1 1-1h12.9c0.5 0 1 0.5 1 1L149.3 86.8z"
    />
    <path
      class="light_fixture"
      d="M140.4 73.2c-0.5-0.2-0.7-0.8-0.5-1.3l0 0c0.2-0.5 0.3-0.9 0.3-1.3l0 0c0-1.5-1.4-2.7-2.2-3.6l0 0c-0.5-0.6-0.7-1.5-0.8-2.4l0 0c-0.1-1.5 1-3.4 3.3-3.6l0 0 0.1 0 0.1 0c1.2 0 2.2 0.3 2.9 1l0 0c0.7 0.6 1 1.5 1 2.3l0 0c0 1.3-0.6 2.4-1.2 3.4l0 0c-0.4 0.6-0.9 1.1-1.4 1.5l0 0c0.2 0.5 0.3 1 0.3 1.5l0 0c0 0.6-0.1 1.3-0.4 2.1l0 0h0c-0.2 0.4-0.5 0.6-0.9 0.6l0 0C140.7 73.3 140.6 73.3 140.4 73.2L140.4 73.2zM139.2 64.6c0 0.5 0.2 1.1 0.3 1.2l0 0c0.2 0.3 0.8 0.8 1.4 1.6l0 0c0.2-0.2 0.5-0.5 0.8-0.9l0 0c0.5-0.7 0.9-1.7 0.9-2.3l0 0c-0.1-0.7 0-1-1.9-1.2l0 0C139.4 63.3 139.3 63.8 139.2 64.6L139.2 64.6z"
    />
    <path
      class="red_bulb blink-6 bulb"
      d="M65.2 95.9c-1.5-3.3-0.6-11-0.6-11 0-2.2-1.2-4-3.4-4h-7.1c-2.2 0-3.4 1.8-3.4 4 0 0 0.7 7.5-0.6 11 -1.2 3.5-6.2 7.8-6.2 13.4 0 8.9 6.2 16.1 13.7 16.1 7.6 0 13.7-7.2 13.7-16.1C71.4 103.7 66.7 99.2 65.2 95.9z"
    />
    <path
      class="light_fixture"
      d="M65.6 90.4c0 0.5-0.4 1-1 1H50.6c-0.5 0-1-0.5-1-1l0.5-14.9c0-0.5 0.5-1 1-1h12.9c0.5 0 1 0.5 1 1L65.6 90.4z"
    />
    <path
      class="light_fixture"
      d="M56.8 76.8c-0.5-0.2-0.7-0.8-0.5-1.3l0 0c0.2-0.5 0.3-0.9 0.3-1.3l0 0c0-1.5-1.4-2.7-2.2-3.6l0 0c-0.5-0.6-0.7-1.5-0.8-2.4l0 0c-0.1-1.5 1-3.4 3.3-3.6l0 0 0.1 0 0.1 0c1.2 0 2.2 0.3 2.9 1l0 0c0.7 0.6 1 1.5 1 2.3l0 0c0 1.3-0.6 2.4-1.2 3.4l0 0c-0.4 0.6-0.9 1.1-1.4 1.5l0 0c0.2 0.5 0.3 1 0.3 1.5l0 0c0 0.6-0.1 1.3-0.4 2.1l0 0h0c-0.2 0.4-0.5 0.6-0.9 0.6l0 0C57.1 76.9 56.9 76.9 56.8 76.8L56.8 76.8zM55.5 68.3c0 0.5 0.2 1.1 0.3 1.2l0 0c0.2 0.3 0.8 0.8 1.4 1.6l0 0c0.2-0.2 0.5-0.5 0.8-0.9l0 0c0.5-0.7 0.9-1.7 0.9-2.3l0 0c-0.1-0.7 0-1-1.9-1.2l0 0C55.7 66.9 55.6 67.4 55.5 68.3L55.5 68.3z"
    />
    <path
      class="gold_bulb blink-7 bulb"
      d="M-18.4 95.1c-1.5-3.3-0.6-11-0.6-11 0-2.2-1.2-4-3.4-4h-7.1c-2.2 0-3.4 1.8-3.4 4 0 0 0.7 7.5-0.6 11 -1.2 3.5-6.2 7.8-6.2 13.4 0 8.9 6.2 16.1 13.7 16.1 7.6 0 13.7-7.2 13.7-16.1C-12.3 102.9-16.9 98.3-18.4 95.1z"
    />
    <path
      class="light_fixture"
      d="M-18 89.6c0 0.5-0.4 1-1 1H-33c-0.5 0-1-0.5-1-1l0.5-14.9c0-0.5 0.5-1 1-1h12.9c0.5 0 1 0.5 1 1L-18 89.6z"
    />
    <path
      class="light_fixture"
      d="M-26.8 76c-0.5-0.2-0.7-0.8-0.5-1.3l0 0c0.2-0.5 0.3-0.9 0.3-1.3l0 0c0-1.5-1.4-2.7-2.2-3.6l0 0c-0.5-0.6-0.7-1.5-0.8-2.4l0 0c-0.1-1.5 1-3.4 3.3-3.6l0 0 0.1 0 0.1 0c1.2 0 2.2 0.3 2.9 1l0 0c0.7 0.6 1 1.5 1 2.3l0 0c0 1.3-0.6 2.4-1.2 3.4l0 0c-0.4 0.6-0.9 1.1-1.4 1.5l0 0c0.2 0.5 0.3 1 0.3 1.5l0 0c0 0.6-0.1 1.3-0.4 2.1l0 0h0c-0.2 0.4-0.5 0.6-0.9 0.6l0 0C-26.6 76.1-26.7 76.1-26.8 76L-26.8 76zM-28.1 67.4c0 0.5 0.2 1.1 0.3 1.2l0 0c0.2 0.3 0.8 0.8 1.4 1.6l0 0c0.2-0.2 0.5-0.5 0.8-0.9l0 0c0.5-0.7 0.9-1.6 0.9-2.3l0 0c-0.1-0.7 0-1-1.9-1.2l0 0C-27.9 66-28 66.6-28.1 67.4L-28.1 67.4z"
    />
    <path
      class="green_bulb bulb blink-9"
      d="M-102.1 75.8c-1.5-3.3-0.6-11-0.6-11 0-2.2-1.2-4-3.4-4h-7.1c-2.2 0-3.4 1.8-3.4 4 0 0 0.7 7.5-0.6 11 -1.2 3.5-6.2 7.8-6.2 13.4 0 8.9 6.2 16.1 13.7 16.1s13.7-7.2 13.7-16.1C-95.9 83.6-100.5 79.1-102.1 75.8z"
    />
    <path
      class="light_fixture"
      d="M-101.7 70.3c0 0.5-0.4 1-1 1h-14.1c-0.5 0-1-0.5-1-1l0.5-14.9c0-0.5 0.5-1 1-1h12.9c0.5 0 1 0.5 1 1L-101.7 70.3z"
    />
    <path
      class="light_fixture"
      d="M-110.5 56.7c-0.5-0.2-0.7-0.8-0.5-1.3l0 0c0.2-0.5 0.3-0.9 0.3-1.3l0 0c0-1.5-1.4-2.7-2.2-3.6l0 0c-0.5-0.6-0.7-1.5-0.8-2.4l0 0c-0.1-1.5 1-3.4 3.3-3.6l0 0 0.1 0 0.1 0c1.2 0 2.2 0.3 2.9 1l0 0c0.7 0.6 1 1.5 1 2.3l0 0c0 1.3-0.6 2.4-1.2 3.4l0 0c-0.4 0.6-0.9 1.1-1.4 1.5l0 0c0.2 0.5 0.3 1 0.3 1.5l0 0c0 0.6-0.1 1.3-0.4 2.1l0 0h0c-0.2 0.4-0.5 0.6-0.9 0.6l0 0C-110.2 56.8-110.3 56.8-110.5 56.7L-110.5 56.7zM-111.7 48.1c0 0.5 0.2 1.1 0.3 1.2l0 0c0.2 0.3 0.8 0.8 1.4 1.6l0 0c0.2-0.2 0.5-0.5 0.8-0.9l0 0c0.5-0.7 0.9-1.7 0.9-2.3l0 0c-0.1-0.7 0-1-1.9-1.2l0 0C-111.6 46.8-111.6 47.3-111.7 48.1L-111.7 48.1z"
    />
    <path
      class="blue_bulb blink-10 bulb"
      d="M-185.7 35.8c-1.5-3.3-0.6-11-0.6-11 0-2.2-1.2-4-3.4-4h-7.1c-2.2 0-3.4 1.8-3.4 4 0 0 0.7 7.5-0.6 11 -1.2 3.5-6.2 7.8-6.2 13.4 0 8.9 6.2 16.1 13.7 16.1 7.6 0 13.7-7.2 13.7-16.1C-179.5 43.6-184.2 39.1-185.7 35.8z"
    />
    <path
      class="light_fixture"
      d="M-185.3 30.3c0 0.5-0.4 1-1 1h-14.1c-0.5 0-1-0.4-1-1l0.5-14.9c0-0.5 0.5-1 1-1h12.9c0.5 0 1 0.4 1 1L-185.3 30.3z"
    />
    <path
      class="light_fixture"
      d="M-194.1 16.8c-0.5-0.2-0.7-0.8-0.5-1.3l0 0c0.2-0.5 0.3-0.9 0.3-1.3l0 0c0-1.5-1.4-2.7-2.2-3.6l0 0c-0.5-0.6-0.7-1.5-0.8-2.4l0 0c-0.1-1.5 1-3.4 3.3-3.6l0 0 0.1 0 0.1 0c1.2 0 2.2 0.3 2.9 1l0 0c0.7 0.6 1 1.5 1 2.3l0 0c0 1.3-0.6 2.4-1.2 3.4l0 0c-0.4 0.6-0.9 1.1-1.4 1.5l0 0c0.2 0.5 0.3 1 0.3 1.5l0 0c0 0.6-0.1 1.3-0.4 2.1l0 0h0c-0.2 0.4-0.5 0.6-0.9 0.6l0 0C-193.9 16.8-194 16.8-194.1 16.8L-194.1 16.8zM-195.4 8.2c0 0.5 0.2 1.1 0.3 1.2l0 0c0.2 0.3 0.8 0.8 1.4 1.6l0 0c0.2-0.2 0.5-0.5 0.8-0.9l0 0c0.5-0.7 0.9-1.7 0.9-2.3l0 0c-0.1-0.7 0-1-1.9-1.2l0 0C-195.2 6.8-195.3 7.4-195.4 8.2L-195.4 8.2z"
    />
    <path
      class="red_bulb blink-1 bulb"
      d="M-269.4 75.4c-1.5-3.3-0.6-11-0.6-11 0-2.2-1.2-4-3.4-4h-7.1c-2.2 0-3.4 1.8-3.4 4 0 0 0.7 7.5-0.6 11 -1.2 3.5-6.2 7.8-6.2 13.4 0 8.9 6.2 16.1 13.7 16.1 7.6 0 13.7-7.2 13.7-16.1C-263.2 83.2-267.8 78.7-269.4 75.4z"
    />
    <path
      class="light_fixture"
      d="M-268.9 69.9c0 0.5-0.4 1-1 1H-284c-0.5 0-1-0.5-1-1l0.5-14.9c0-0.5 0.5-1 1-1h12.9c0.5 0 1 0.5 1 1L-268.9 69.9z"
    />
    <path
      class="light_fixture"
      d="M-277.7 56.3c-0.5-0.2-0.7-0.8-0.5-1.3l0 0c0.2-0.5 0.3-0.9 0.3-1.3l0 0c0-1.5-1.4-2.7-2.2-3.6l0 0c-0.5-0.6-0.7-1.5-0.8-2.4l0 0c-0.1-1.5 1-3.4 3.3-3.6l0 0 0.1 0 0.1 0c1.2 0 2.2 0.3 2.9 1l0 0c0.7 0.6 1 1.5 1 2.3l0 0c0 1.3-0.6 2.4-1.2 3.4l0 0c-0.4 0.6-0.9 1.1-1.4 1.5l0 0c0.2 0.5 0.3 1 0.3 1.5l0 0c0 0.6-0.1 1.3-0.4 2.1l0 0h0c-0.2 0.4-0.5 0.6-0.9 0.6l0 0C-277.5 56.4-277.6 56.4-277.7 56.3L-277.7 56.3zM-279 47.7c0 0.5 0.2 1.1 0.3 1.2l0 0c0.2 0.3 0.8 0.8 1.4 1.6l0 0c0.2-0.2 0.5-0.5 0.8-0.9l0 0c0.5-0.7 0.9-1.7 0.9-2.3l0 0c-0.1-0.7 0-1-1.9-1.2l0 0C-278.8 46.4-278.9 46.9-279 47.7L-279 47.7z"
    />
    <path
      class="white_bulb blink-2 bulb"
      d="M-353.4 93.3c-1.5-3.3-0.6-11-0.6-11 0-2.2-1.2-4-3.4-4h-7.1c-2.2 0-3.4 1.8-3.4 4 0 0 0.7 7.5-0.6 11 -1.2 3.5-6.2 7.8-6.2 13.4 0 8.9 6.2 16.1 13.7 16.1 7.6 0 13.7-7.2 13.7-16.1C-347.2 101.1-351.9 96.6-353.4 93.3z"
    />
    <path
      class="light_fixture"
      d="M-353 87.8c0 0.5-0.4 1-1 1H-368c-0.5 0-1-0.5-1-1l0.5-14.9c0-0.5 0.5-1 1-1h12.9c0.5 0 1 0.5 1 1L-353 87.8z"
    />
    <path
      class="light_fixture"
      d="M-361.8 74.2c-0.5-0.2-0.7-0.8-0.5-1.3l0 0c0.2-0.5 0.3-0.9 0.3-1.3l0 0c0-1.5-1.4-2.7-2.2-3.6l0 0c-0.5-0.6-0.7-1.5-0.8-2.4l0 0c-0.1-1.5 1-3.4 3.3-3.6l0 0 0.1 0 0.1 0c1.2 0 2.2 0.3 2.9 1l0 0c0.7 0.6 1 1.5 1 2.3l0 0c0 1.3-0.6 2.4-1.2 3.4l0 0c-0.4 0.6-0.9 1.1-1.4 1.5l0 0c0.2 0.5 0.3 1 0.3 1.5l0 0c0 0.6-0.1 1.3-0.4 2.1l0 0h0c-0.2 0.4-0.5 0.6-0.9 0.6l0 0C-361.6 74.3-361.7 74.3-361.8 74.2L-361.8 74.2zM-363.1 65.6c0 0.5 0.2 1.1 0.3 1.2l0 0c0.2 0.2 0.8 0.8 1.4 1.6l0 0c0.2-0.2 0.5-0.5 0.8-0.9l0 0c0.5-0.7 0.9-1.7 0.9-2.3l0 0c-0.1-0.7 0-1-1.9-1.2l0 0C-362.9 64.3-363 64.8-363.1 65.6L-363.1 65.6z"
    />
  </svg> -->
</template>

<script>
import getRoleNameById from "@/utils/getRoleNameById";
import NoticesView from "@/components/NoticesView.vue";
import axios from "axios";
import store from "@/store/index";
import config from "../../config.js";
import { BellOutlined, MenuOutlined } from "@ant-design/icons-vue";
import router from "@/router";
import colors from "@/utils/colors";
import getCityById from "../utils/getCityById";
import HeaderLeft from "./HeaderLeft.vue";

export default {
  data() {
    return {
      burger_check: false,
      visible: false,
      colors: colors,
    };
  },
  components: {
    MenuOutlined,
    HeaderLeft,
    BellOutlined,
    NoticesView,
  },
  name: "HeaderView",
  watch: {
    $route() {
      this.burger_check = false;
    },
  },
  methods: {
    getLocalLang() {
      return localStorage.getItem("lang");
    },
    onCloseMenu() {
      this.burger_check = false;
    },
    showMenu() {
      this.burger_check = true;
    },
    getCityById(id) {
      return getCityById(id);
    },
    async showDrawerNotice() {
      this.visible = true;
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${window.localStorage.getItem("jwt")}`;
      await axios.put(config.API_URL + "api/user/notice");
      this.$store.commit("setNoticeCount", 0);
    },
    onCloseNotice() {
      this.visible = false;
    },
    async onDeleteNotice() {
      store.commit("setIsLoading", true);
      await axios.delete(config.API_URL + "api/user/notice");
      store.commit("setIsLoading", false);
      this.$store.commit("setNotices", []),
        this.$store.commit("setNoticeCount", 0);
    },
    getRoleNameById(id) {
      return getRoleNameById(id);
    },
    async clickCabinet({ key }) {
      if (key == 1) {
        await axios.post(config.API_URL + "api/user/logout");
        this.$store.state.isAuth = false;
        window.localStorage.setItem("jwt", "");
        router.push("/login");
      } else if (key == 2) {
        router.push("/cabinet");
      }
    },
    clickLang({ key }) {
      this.$emit("switchLang", key);
    },
  },
  async beforeMount() {
    axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${window.localStorage.getItem("jwt")}`;
    await axios
      .get(config.API_URL + "api/user/notice")
      .then((res) => {
        if (res.data.notices && res.data.notices.rows) {
          this.$store.commit(
            "setNoticeCount",
            res.data.notices.rows.filter((notice) => notice.viewed === false)
              .length
          );
          this.$store.commit("setNotices", res.data.notices.rows);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  },
};
</script>

<style>
/* Simple SVG Christmas Lights Animation */

.Christmas_Lights {
  display: flex;
  justify-content: space-between;
  top: -45px;
  margin: auto;
  max-height: 100%;
  text-align: center;
  position: relative;
  width: 100%;
  max-width: 1440px;
  z-index: -1000;
}

.light_cord {
  fill: none;
  stroke: #174700;
}

.light_fixture {
  fill: #134413;
}

.red_bulb {
  fill: #ca2128;
  stroke: #6d6d6d;
  stroke-miterlimit: 10;
}

.green_bulb {
  fill: #2d754a;
  stroke: #6d6d6d;
  stroke-miterlimit: 10;
}

.blue_bulb {
  fill: #2c3ea8;
  stroke: #6d6d6d;
  stroke-miterlimit: 10;
}

.white_bulb {
  fill: #f5eed7;
  stroke: #6d6d6d;
  stroke-miterlimit: 10;
}

.gold_bulb {
  fill: #ffcc5e;
  stroke: #6d6d6d;
  stroke-miterlimit: 10;
}

/* Simply changing the opacity of the SVG fill to create the glow effect for the bulbs */

.bulb {
  -webkit-animation-duration: 0.5s;
  -webkit-animation-name: glow;
  -webkit-animation-iteration-count: infinite;
  -webkit-animation-timing-function: ease-in-out;
  -webkit-animation-direction: alternate;
  animation-name: glow;
  animation-duration: 0.5s;
  animation-iteration-count: infinite;
  animation-timing-function: ease-in-out;
  animation-direction: alternate;
}

@-webkit-keyframes glow {
  0% {
    fill-opacity: 0.25;
  }
  100% {
    fill-opacity: 1;
  }
}

@keyframes glow {
  0% {
    fill-opacity: 0.25;
  }
  100% {
    fill-opacity: 1;
  }
}

/* Made a set of ten animation delays to create a more random effect of lights blinking.  Simplest way without jumping through SVG hoops. */

.blink-1 {
  -webkit-animation-delay: 0.6s;
  animation-delay: 0.6s;
}

.blink-2 {
  -webkit-animation-delay: 2s;
  animation-delay: 2s;
}

.blink-3 {
  -webkit-animation-delay: 2s;
  animation-delay: 2s;
}

.blink-4 {
  -webkit-animation-delay: 6s;
  animation-delay: 6s;
}

.blink-5 {
  -webkit-animation-delay: 2.5s;
  animation-delay: 2.5s;
}

.blink-6 {
  -webkit-animation-delay: 0.3s;
  animation-delay: 0.3s;
}

.blink-7 {
  -webkit-animation-delay: 2s;
  animation-delay: 2s;
}

.blink-8 {
  -webkit-animation-delay: 0.2s;
  animation-delay: 0.2s;
}

.blink-9 {
  -webkit-animation-delay: 0.95s;
  animation-delay: 0.95s;
}

.blink-10 {
  -webkit-animation-delay: 1.2s;
  animation-delay: 1.2s;
}
.status-block {
  font-family: "Montserrat";
  font-size: 18px;
  font-weight: 550;
  color: white;
  background-color: #181734;
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
}
.header-block {
  font-family: "Montserrat";
  font-size: 16px;
  font-weight: 550;
  color: white;
  background-color: #181734;
  display: flex;
  justify-content: space-between;
  box-shadow: 0px 2px 5px black;
  width: 100%;
}
.header-left-block {
  padding: 20px;
  display: flex;
  width: 100%;
  align-items: center;
}
.header-button {
  cursor: pointer;
}

.router-link {
  padding: 5px;
  color: white;
  margin-right: 10px;
  text-decoration: none;
  border-radius: 5px;
}

.router-linkright {
  padding: 5px;
  color: white;

  text-decoration: none;
  border-radius: 5px;
}
.spacer {
  margin-left: 20px;
}

.header-links-block {
  display: flex;
  align-items: center;
}

.header-icons-block {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: end;
}

.header-links-block p {
  margin: 0;
  margin-right: 30px;
  white-space: nowrap;
  text-align: center;
}

.header-icons-block p {
  margin: 0;
  margin-right: 10px;
  white-space: nowrap;
  text-align: center;
}

.header-icons-block .d-flex {
  display: flex;
  justify-content: space-between;
}

.header-icons-block .d-flex.header-button {
  color: white;
}

.header-icons-block .header-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
}
.span {
  color: aqua;
}

.notice-number {
  font-size: 8px;
  padding: 0;
  margin: 0;
  margin-top: -10px;
  margin-left: -10px;
  padding-bottom: 5px;
  display: block;
  text-align: center;
  width: 12px;
  height: 12px;
  border-radius: 10px;
  background-color: red;
}
</style>
