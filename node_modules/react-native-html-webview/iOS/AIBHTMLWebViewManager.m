//
//  AIBHTMLWebViewManager.m
//  AIBHTMLWebView
//
//  Created by Thomas Parslow on 05/04/2015.
//  Copyright (c) 2015 Thomas Parslow. MIT Licensed
//

#import "AIBHTMLWebViewManager.h"
#import "AIBHTMLWebView.h"
#import "RCTBridge.h"

#import <UIKit/UIKit.h>

@implementation AIBHTMLWebViewManager

RCT_EXPORT_MODULE();

RCT_REMAP_VIEW_PROPERTY(html, HTML, NSString)
RCT_EXPORT_VIEW_PROPERTY(enableScroll, BOOL)

- (UIView *)view
{
    AIBHTMLWebView *_view;
    _view = [[AIBHTMLWebView alloc] initWithEventDispatcher:self.bridge.eventDispatcher];
    return _view;
}

- (NSDictionary *)customDirectEventTypes
{
    return @{
             @"link": @{
                     @"registrationName": @"onLink"
                     },
             @"contentHeight": @{
                     @"registrationName": @"onContentHeight"
                     }
             };
}

@end
