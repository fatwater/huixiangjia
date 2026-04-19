-- ============================================
-- 会想家(huixiangjia) 数据库初始化脚本
-- 数据库: huixiangjia
-- ============================================

CREATE DATABASE IF NOT EXISTS huixiangjia DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE huixiangjia;

-- -------------------------------------------
-- 租户表
-- -------------------------------------------
CREATE TABLE IF NOT EXISTS `tenants` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT '租户ID',
  `name` VARCHAR(100) NOT NULL COMMENT '租户名称',
  `short_code` VARCHAR(50) NOT NULL UNIQUE COMMENT '租户短码',
  `logo` VARCHAR(255) DEFAULT NULL COMMENT '企业Logo',
  `address` VARCHAR(100) DEFAULT NULL COMMENT '企业地址',
  `wecom_corp_id` VARCHAR(100) DEFAULT NULL COMMENT '企业微信CorpId',
  `wecom_agent_id` VARCHAR(50) DEFAULT NULL COMMENT '企业微信AgentId',
  `status` TINYINT DEFAULT 1 COMMENT '状态: 0-禁用, 1-启用',
  `expire_date` DATETIME DEFAULT NULL COMMENT '到期日期',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  INDEX `idx_short_code` (`short_code`),
  INDEX `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='租户表';

-- -------------------------------------------
-- 用户表
-- -------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT '用户ID',
  `tenant_id` INT UNSIGNED NOT NULL COMMENT '租户ID',
  `wx_userid` VARCHAR(64) NOT NULL COMMENT '企业微信UserId',
  `name` VARCHAR(50) NOT NULL COMMENT '姓名',
  `phone` VARCHAR(20) DEFAULT NULL COMMENT '手机号',
  `avatar` VARCHAR(255) DEFAULT NULL COMMENT '头像URL',
  `role` VARCHAR(20) DEFAULT 'employee' COMMENT '角色: admin/employee',
  `password` VARCHAR(100) DEFAULT NULL COMMENT '密码(MD5)',
  `status` TINYINT DEFAULT 1 COMMENT '状态: 0-禁用, 1-启用',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  INDEX `idx_tenant_id` (`tenant_id`),
  INDEX `idx_wx_userid` (`wx_userid`),
  UNIQUE KEY `uk_tenant_wx` (`tenant_id`, `wx_userid`),
  CONSTRAINT `fk_users_tenant` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- -------------------------------------------
-- 会议室表
-- -------------------------------------------
CREATE TABLE IF NOT EXISTS `meeting_rooms` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT '会议室ID',
  `tenant_id` INT UNSIGNED NOT NULL COMMENT '租户ID',
  `name` VARCHAR(50) NOT NULL COMMENT '会议室名称',
  `location` VARCHAR(100) DEFAULT NULL COMMENT '位置',
  `capacity` INT DEFAULT 10 COMMENT '容纳人数',
  `facilities` VARCHAR(255) DEFAULT NULL COMMENT '设施(JSON)',
  `status` TINYINT DEFAULT 1 COMMENT '状态: 0-不可用, 1-可用',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  INDEX `idx_tenant_id` (`tenant_id`),
  CONSTRAINT `fk_mr_tenant` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='会议室表';

-- -------------------------------------------
-- 会议室预约表
-- -------------------------------------------
CREATE TABLE IF NOT EXISTS `room_bookings` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT '预约ID',
  `tenant_id` INT UNSIGNED NOT NULL COMMENT '租户ID',
  `room_id` INT UNSIGNED NOT NULL COMMENT '会议室ID',
  `user_id` INT UNSIGNED NOT NULL COMMENT '预约用户ID',
  `title` VARCHAR(100) NOT NULL COMMENT '会议主题',
  `book_date` DATE NOT NULL COMMENT '预约日期',
  `start_time` TIME NOT NULL COMMENT '开始时间',
  `end_time` TIME NOT NULL COMMENT '结束时间',
  `status` TINYINT DEFAULT 1 COMMENT '状态: 0-已取消, 1-待审核, 2-已通过, 3-已拒绝',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  INDEX `idx_tenant_room_date` (`tenant_id`, `room_id`, `book_date`),
  INDEX `idx_user_id` (`user_id`),
  CONSTRAINT `fk_booking_room` FOREIGN KEY (`room_id`) REFERENCES `meeting_rooms` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_booking_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='会议室预约表';

-- -------------------------------------------
-- 商家表
-- -------------------------------------------
CREATE TABLE IF NOT EXISTS `merchants` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT '商家ID',
  `tenant_id` INT UNSIGNED NOT NULL COMMENT '租户ID',
  `name` VARCHAR(50) NOT NULL COMMENT '商家名称',
  `category` VARCHAR(30) DEFAULT NULL COMMENT '分类',
  `cover_image` VARCHAR(255) DEFAULT NULL COMMENT '封面图',
  `images` VARCHAR(500) DEFAULT NULL COMMENT '图片集(JSON)',
  `description` VARCHAR(500) DEFAULT NULL COMMENT '简介',
  `address` VARCHAR(100) DEFAULT NULL COMMENT '地址',
  `phone` VARCHAR(20) DEFAULT NULL COMMENT '联系电话',
  `business_hours` VARCHAR(100) DEFAULT NULL COMMENT '营业时间',
  `avg_rating` DECIMAL(2,1) DEFAULT 5.0 COMMENT '平均评分',
  `review_count` INT DEFAULT 0 COMMENT '评价数',
  `discount` VARCHAR(50) DEFAULT NULL COMMENT '优惠信息',
  `status` TINYINT DEFAULT 1 COMMENT '状态: 0-下架, 1-上架',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  INDEX `idx_tenant_id` (`tenant_id`),
  INDEX `idx_category` (`category`),
  CONSTRAINT `fk_merchant_tenant` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='商家表';

-- -------------------------------------------
-- 用户收藏表
-- -------------------------------------------
CREATE TABLE IF NOT EXISTS `favorites` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT '收藏ID',
  `user_id` INT UNSIGNED NOT NULL COMMENT '用户ID',
  `merchant_id` INT UNSIGNED NOT NULL COMMENT '商家ID',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '收藏时间',
  UNIQUE KEY `uk_user_merchant` (`user_id`, `merchant_id`),
  CONSTRAINT `fk_fav_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_fav_merchant` FOREIGN KEY (`merchant_id`) REFERENCES `merchants` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户收藏表';

-- -------------------------------------------
-- 团购商品表
-- -------------------------------------------
CREATE TABLE IF NOT EXISTS `products` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT '商品ID',
  `tenant_id` INT UNSIGNED NOT NULL COMMENT '租户ID',
  `title` VARCHAR(100) NOT NULL COMMENT '商品标题',
  `cover_image` VARCHAR(255) DEFAULT NULL COMMENT '封面图',
  `images` VARCHAR(500) DEFAULT NULL COMMENT '图片集(JSON)',
  `description` TEXT DEFAULT NULL COMMENT '商品详情',
  `original_price` DECIMAL(10,2) NOT NULL COMMENT '原价',
  `groupbuy_price` DECIMAL(10,2) NOT NULL COMMENT '团购价',
  `min_group_size` INT DEFAULT 2 COMMENT '最小成团人数',
  `stock` INT DEFAULT 0 COMMENT '库存',
  `sold_count` INT DEFAULT 0 COMMENT '已售',
  `start_time` DATETIME DEFAULT NULL COMMENT '开始时间',
  `end_time` DATETIME DEFAULT NULL COMMENT '结束时间',
  `status` TINYINT DEFAULT 1 COMMENT '状态: 0-已下架, 1-上架',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  INDEX `idx_tenant_id` (`tenant_id`),
  INDEX `idx_status` (`status`),
  CONSTRAINT `fk_product_tenant` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='团购商品表';

-- -------------------------------------------
-- 团购订单表
-- -------------------------------------------
CREATE TABLE IF NOT EXISTS `orders` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT '订单ID',
  `order_no` VARCHAR(32) NOT NULL UNIQUE COMMENT '订单号',
  `tenant_id` INT UNSIGNED NOT NULL COMMENT '租户ID',
  `user_id` INT UNSIGNED NOT NULL COMMENT '用户ID',
  `product_id` INT UNSIGNED NOT NULL COMMENT '商品ID',
  `quantity` INT DEFAULT 1 COMMENT '数量',
  `total_amount` DECIMAL(10,2) NOT NULL COMMENT '总金额',
  `group_code` VARCHAR(32) DEFAULT NULL COMMENT '拼团码',
  `group_status` TINYINT DEFAULT 0 COMMENT '拼团状态: 0-未成团, 1-已成团, 2-已成团待提货',
  `pay_status` TINYINT DEFAULT 0 COMMENT '支付状态: 0-待支付, 1-已支付',
  `pay_time` DATETIME DEFAULT NULL COMMENT '支付时间',
  `pickup_code` VARCHAR(16) DEFAULT NULL COMMENT '提货码',
  `pickup_time` DATETIME DEFAULT NULL COMMENT '提货时间',
  `status` TINYINT DEFAULT 1 COMMENT '状态: 0-已取消, 1-待支付, 2-待提货, 3-已完成',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  INDEX `idx_tenant_id` (`tenant_id`),
  INDEX `idx_user_id` (`user_id`),
  INDEX `idx_order_no` (`order_no`),
  INDEX `idx_group_code` (`group_code`),
  CONSTRAINT `fk_order_tenant` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_order_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_order_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='团购订单表';

-- -------------------------------------------
-- 访客预约表
-- -------------------------------------------
CREATE TABLE IF NOT EXISTS `visitors` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT '访客ID',
  `tenant_id` INT UNSIGNED NOT NULL COMMENT '租户ID',
  `host_id` INT UNSIGNED NOT NULL COMMENT '受访人ID',
  `visitor_name` VARCHAR(50) NOT NULL COMMENT '访客姓名',
  `visitor_phone` VARCHAR(20) NOT NULL COMMENT '访客手机',
  `visitor_company` VARCHAR(100) DEFAULT NULL COMMENT '访客公司',
  `visit_purpose` VARCHAR(200) DEFAULT NULL COMMENT '来访目的',
  `visit_date` DATE NOT NULL COMMENT '来访日期',
  `start_time` TIME DEFAULT NULL COMMENT '开始时间',
  `end_time` TIME DEFAULT NULL COMMENT '结束时间',
  `qr_code` VARCHAR(128) DEFAULT NULL COMMENT '通行二维码',
  `status` TINYINT DEFAULT 1 COMMENT '状态: 0-已拒绝, 1-待审核, 2-已通过, 3-已完成',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  INDEX `idx_tenant_id` (`tenant_id`),
  INDEX `idx_host_id` (`host_id`),
  INDEX `idx_visit_date` (`visit_date`),
  CONSTRAINT `fk_visitor_tenant` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_visitor_host` FOREIGN KEY (`host_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='访客预约表';

-- -------------------------------------------
-- 门禁通行记录表
-- -------------------------------------------
CREATE TABLE IF NOT EXISTS `access_logs` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT '记录ID',
  `tenant_id` INT UNSIGNED NOT NULL COMMENT '租户ID',
  `user_id` INT UNSIGNED NOT NULL COMMENT '用户ID',
  `visitor_id` INT UNSIGNED DEFAULT NULL COMMENT '访客ID',
  `device_id` VARCHAR(64) DEFAULT NULL COMMENT '设备ID',
  `device_name` VARCHAR(100) DEFAULT NULL COMMENT '设备名称',
  `access_type` VARCHAR(20) NOT NULL COMMENT '通行类型: qr/nfc/face/password',
  `access_result` TINYINT NOT NULL COMMENT '通行结果: 0-拒绝, 1-允许',
  `access_time` DATETIME NOT NULL COMMENT '通行时间',
  `remark` VARCHAR(255) DEFAULT NULL COMMENT '备注',
  INDEX `idx_tenant_id` (`tenant_id`),
  INDEX `idx_user_id` (`user_id`),
  INDEX `idx_access_time` (`access_time`),
  CONSTRAINT `fk_access_tenant` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_access_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='门禁通行记录表';

-- ============================================
-- 初始化测试数据
-- ============================================

-- 插入默认租户
INSERT INTO `tenants` (`name`, `short_code`, `status`, `expire_date`) VALUES
  ('演示企业', 'demo', 1, DATE_ADD(NOW(), INTERVAL 1 YEAR));

-- 插入管理员用户 (密码: admin123, MD5 hash)
INSERT INTO `users` (`tenant_id`, `wx_userid`, `name`, `phone`, `role`, `password`) VALUES
  (1, 'admin001', '系统管理员', '13800138000', 'admin', '0192023a7bbd73250516f069df18b500');

-- 插入会议室
INSERT INTO `meeting_rooms` (`tenant_id`, `name`, `location`, `capacity`, `facilities`, `status`) VALUES
  (1, '一号会议室', 'A栋 3层 301', 10, '["投影仪","白板","电话会议"]', 1),
  (1, '二号会议室', 'A栋 3层 302', 6, '["电视","白板"]', 1),
  (1, '三号会议室', 'A栋 4层 401', 20, '["投影仪","白板","音响系统","视频会议"]', 1),
  (1, '董事会议室', 'A栋 5层 501', 30, '["投影仪","音响系统","视频会议","茶歇区"]', 1);

-- 插入商家
INSERT INTO `merchants` (`tenant_id`, `name`, `category`, `cover_image`, `description`, `address`, `phone`, `business_hours`, `discount`) VALUES
  (1, '星巴克咖啡', '咖啡', 'https://img.yzcdn.cn/vant/cat.jpeg', '精品咖啡连锁店，提供各类咖啡饮品和甜点', 'A栋 1层', '021-12345678', '07:00-22:00', '员工价85折'),
  (1, '康体健身', '健身', 'https://img.yzcdn.cn/vant/cat.jpeg', '专业健身房，提供器械健身和私教课程', 'B栋 2层', '021-23456789', '06:00-23:00', '新会员免费体验'),
  (1, '员工餐厅', '餐饮', 'https://img.yzcdn.cn/vant/cat.jpeg', '提供早中晚三餐，川湘粤菜系', 'A栋 2层', '021-34567890', '早餐7:00-9:00 午餐11:30-13:30 晚餐17:30-20:00', '工作日午餐套餐28元');

-- 插入团购商品
INSERT INTO `products` (`tenant_id`, `title`, `cover_image`, `description`, `original_price`, `groupbuy_price`, `stock`, `sold_count`, `start_time`, `end_time`, `status`) VALUES
  (1, '星巴克礼品卡 100元', 'https://img.yzcdn.cn/vant/cat.jpeg', '面值100元星巴克礼品卡，全部门店通用', 100.00, 85.00, 100, 12, NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY), 1),
  (1, '康体健身月卡', 'https://img.yzcdn.cn/vant/cat.jpeg', '原价299元/月，团购价199元/月，含器械使用和团课', 299.00, 199.00, 50, 8, NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY), 1),
  (1, '员工餐厅午餐券 10张装', 'https://img.yzcdn.cn/vant/cat.jpeg', '员工餐厅午餐券10张，原价280元，团购价220元', 280.00, 220.00, 200, 45, NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY), 1);
