import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  HttpException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';

export type ApiErrorKey = `errors.${string}`;

export function isApiErrorKey(message: string): message is ApiErrorKey {
  return message.startsWith('errors.') && !message.includes(' ');
}

export const LEGACY_API_ERROR_MESSAGE_KEYS: Readonly<
  Record<string, ApiErrorKey>
> = {
  'Authentication required': 'errors.common.authRequired',
  'User not found': 'errors.common.userNotFound',
  'ID is required': 'errors.common.idRequired',
  'Internal server error': 'errors.common.internalServerError',
  'Thiếu tham số locale': 'errors.common.localeRequired',
  'Product not found': 'errors.product.notFound',
  'Product variant not found': 'errors.product.variantNotFound',
  'Khi cập nhật variant, cần gửi đầy đủ options và variants':
    'errors.product.variantUpdateIncomplete',
  'Insufficient stock': 'errors.product.insufficientStock',
  'Product option not found': 'errors.product.optionNotFound',
  'Product option value not found': 'errors.product.optionValueNotFound',
  'Product attribute not found': 'errors.product.attributeNotFound',
  'Category not found': 'errors.category.notFound',
  'Order not found': 'errors.order.notFound',
  'Order item not found': 'errors.order.itemNotFound',
  'Only pending orders can be deleted': 'errors.order.onlyPendingDeletable',
  'Không tìm thấy đơn hàng': 'errors.order.notFound',
  'Đơn hàng không có sản phẩm': 'errors.order.noItems',
  'Đơn hàng đã thanh toán thành công': 'errors.order.alreadyPaid',
  'Mã giảm giá không tồn tại': 'errors.coupon.notExists',
  'Mã đã hết lượt sử dụng': 'errors.coupon.usageLimitReached',
  'Mã không khả dụng': 'errors.coupon.notAvailable',
  'Tài khoản guest không thể claim': 'errors.order.guestCannotClaim',
  'Không tìm thấy payment': 'errors.payment.notFound',
  'Payment không gắn với đơn hàng': 'errors.payment.notLinkedToOrder',
  'Payment đã ở trạng thái completed': 'errors.payment.alreadyCompleted',
  'Đơn hàng đã có payment hợp lệ': 'errors.payment.validPaymentExists',
  'Hệ thống PayOS chưa được cấu hình': 'errors.payment.payosNotConfigured',
  'Số tiền không hợp lệ': 'errors.payment.invalidAmount',
  'PayOS chưa được cấu hình': 'errors.payment.payosInternal',
  'Coupon not found': 'errors.coupon.notFound',
  'Mã coupon đã tồn tại': 'errors.coupon.codeExists',
  'validUntil phải sau validFrom': 'errors.coupon.validUntilBeforeFrom',
  'Account not found': 'errors.account.notFound',
  'Không tìm thấy người dùng': 'errors.profile.userNotFound',
  'Không tìm thấy địa chỉ': 'errors.profile.addressNotFound',
  'Token đã hết hạn': 'errors.auth.tokenExpired',
  'Invalid token payload': 'errors.auth.invalidTokenPayload',
  'Email không khớp với token': 'errors.auth.emailMismatch',
  'Invalid "to" date': 'errors.dashboard.invalidToDate',
  'Invalid "from" date': 'errors.dashboard.invalidFromDate',
};

export function translateApiMessage(
  message: string | string[],
  args?: Record<string, unknown>,
): string | string[] {
  const i18n = I18nContext.current();
  if (!i18n) {
    return message;
  }

  const translateOne = (raw: string): string => {
    const key: ApiErrorKey | undefined = isApiErrorKey(raw)
      ? raw
      : LEGACY_API_ERROR_MESSAGE_KEYS[raw];

    if (!key) {
      return raw;
    }

    try {
      return i18n.translate(key, { args });
    } catch {
      return raw;
    }
  };

  if (Array.isArray(message)) {
    return message.map((m) => translateOne(String(m)));
  }
  return translateOne(String(message));
}

function throwWithKey(
  ExceptionClass: new (message: string) => HttpException,
  key: ApiErrorKey,
  args?: Record<string, unknown>,
): never {
  const i18n = I18nContext.current();
  const message = i18n ? i18n.translate(key, { args }) : key;
  throw new ExceptionClass(message);
}

export function apiNotFound(
  key: ApiErrorKey,
  args?: Record<string, unknown>,
): never {
  throwWithKey(NotFoundException, key, args);
}

export function apiBadRequest(
  key: ApiErrorKey,
  args?: Record<string, unknown>,
): never {
  throwWithKey(BadRequestException, key, args);
}

export function apiUnauthorized(
  key: ApiErrorKey,
  args?: Record<string, unknown>,
): never {
  throwWithKey(UnauthorizedException, key, args);
}

export function apiForbidden(
  key: ApiErrorKey,
  args?: Record<string, unknown>,
): never {
  throwWithKey(ForbiddenException, key, args);
}

export function apiConflict(
  key: ApiErrorKey,
  args?: Record<string, unknown>,
): never {
  throwWithKey(ConflictException, key, args);
}

export function apiInternalError(
  key: ApiErrorKey,
  args?: Record<string, unknown>,
): never {
  throwWithKey(InternalServerErrorException, key, args);
}
