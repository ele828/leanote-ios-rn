//
//  AIBHTMLWebView.h
//  AIBHTMLWebView
//
//  Created by Thomas Parslow on 05/04/2015.
//  Copyright (c) 2015 Thomas Parslow. MIT License.
//

#import "RCTView.h"

@class RCTEventDispatcher;

@interface AIBHTMLWebView : RCTView

@property (nonatomic, strong) NSString *HTML;

- (instancetype)initWithEventDispatcher:(RCTEventDispatcher *)eventDispatcher NS_DESIGNATED_INITIALIZER;

@end