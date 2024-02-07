<template>
  <a-drawer
    :visible="props.visible"
    style="color: red"
    :title="$t('button.menu')"
    placement="left"
    @close="onClose"
  >
    <div class="menu-wrapper">
      <div class="menu-link-block">
        <router-link
          v-if="[1, 2, 3, 4, 5, 6, 7, 9].includes($store.state.user.roleId)"
          class="menu-link-element"
          to="/orders"
          :style="'color:' + ($route.path === '/orders' ? 'yellow' : 'white')"
        >
          {{ $t("button.orders") }}
          <a-divider style="background-color: lightslategrey" />
        </router-link>
        <router-link
          v-if="
            [1, 6, 7, 8, 9, 10, 11, 12].includes($store.state.user.roleId) ||
            $store.state.user.id === 14
          "
          class="menu-link-element"
          to="/purchases"
          :style="
            'color:' + ($route.path === '/purchases' ? 'yellow' : 'white')
          "
        >
          {{ $t("button.purchase") }}
          <a-divider style="background-color: lightslategrey" />
        </router-link>
        <router-link
          v-if="
            [1, 2, 6, 7, 8, 9, 10, 11, 12].includes($store.state.user.roleId)
          "
          class="menu-link-element"
          to="/purchases/monitor"
          :style="
            'color:' +
            ($route.path === '/purchases/monitor' ? 'yellow' : 'white')
          "
        >
          {{ $t("button.purchaseTrack") }}
          <a-divider style="background-color: lightslategrey" />
        </router-link>
        <router-link
          class="menu-link-element"
          to="/cash"
          :style="'color:' + ($route.path === '/cash' ? 'yellow' : 'white')"
        >
          {{ $t("Денежные средства") }}
          <a-divider style="background-color: lightslategrey" />
        </router-link>
        <!-- временно отключен -->
        <router-link
          v-if="[1, 13, 14, 15, 16, 17].includes($store.state.user.roleId)"
          class="menu-link-element"
          :to="
            '/logistics' +
            (![1, 13, 14, 15, 16].includes($store.state.user.roleId)
              ? '/monitor'
              : '')
          "
          :style="
            'color:' +
            ($route.path === '/logistics' ||
            $route.path === '/logistics/monitor'
              ? 'yellow'
              : 'white')
          "
        >
          {{ $t("button.logistics") }}
          <a-divider style="background-color: lightslategrey" />
        </router-link>
        <router-link
          class="menu-link-element"
          to="/tasks"
          :style="
            'color:' +
            (['Task', 'Tasks', 'Perform', 'Performs'].includes($route.name)
              ? 'yellow'
              : 'white')
          "
        >
          {{ $t("button.tasks") }}
          <a-divider style="background-color: lightslategrey" />
        </router-link>
        <router-link
          v-if="
            $store.state.user.section &&
            $store.state.user.section.includes('industry')
          "
          class="menu-link-element"
          to="/industry"
          :style="
            'color:' + (['Industry'].includes($route.name) ? 'yellow' : 'white')
          "
        >
          {{ $t("button.industry") }}
          <a-divider style="background-color: lightslategrey" />
        </router-link>
        <router-link
          v-if="
            $store.state.user.section &&
            $store.state.user.section.includes('admin')
          "
          class="menu-link-element"
          to="/company"
          :style="
            'color:' + ($route.path === '/create_cash' ? 'yellow' : 'white')
          "
        >
          Управление данными
          <a-divider style="background-color: lightslategrey" />
        </router-link>
        <router-link
          v-if="$store.state.user.roleId === 1"
          class="menu-link-element"
          to="/create_user"
          :style="
            'color:' + ($route.path === '/create_user' ? 'yellow' : 'white')
          "
        >
          {{ $t("button.users") }}
          <a-divider style="background-color: lightslategrey" />
        </router-link>

        <router-link
          v-if="
            $store.state.user.roleId === 1 || $store.state.user.roleId === 4
          "
          class="menu-link-element"
          to="/create_master"
          :style="
            'color:' + ($route.path === '/create_master' ? 'yellow' : 'white')
          "
        >
          {{ $t("button.masters") }}
          <a-divider style="background-color: lightslategrey" />
        </router-link>
        <div class="menu-opt-block">
          <a
            class="menu-link-element"
            href="https://ceramostone.kz"
            target="_blank"
          >
            {{ $t("button.store") }}
            <a-divider style="background-color: lightslategrey" />
          </a>
          <a class="menu-link-element">
            {{ $t("button.howWork") }}
            <a-divider style="background-color: lightslategrey" />
          </a>
        </div>
      </div>
      <div class="menu-footer">
        <div>
          <p>
            {{ $t("content.cityShort") }}
            {{ getCityById($store.state.user.cityId) }}
          </p>
        </div>
        <div>
          {{ $t("content.techSupport") }}:
          <a href="tel:+77084140300"> +7 708 414 03 00</a>
        </div>
      </div>
    </div>
  </a-drawer>
</template>
<script>
import { defineComponent } from "vue";
import getCityById from "@/utils/getCityById";

export default defineComponent({
  props: {
    visible: Boolean,
  },
  setup(props, { emit }) {
    //   const visible = props.visible;
    const onClose = () => {
      emit("onClose");
    };
    return {
      props,
      onClose,
      getCityById,
    };
  },
});
</script>

<style>
.menu-wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.menu-link-block,
.menu-link-block a {
  font-size: 18px;
  display: inline-block;
  width: 100%;
}

.menu-link-element:hover {
  opacity: 0.5;
}

.menu-footer {
  color: white;
}
</style>
