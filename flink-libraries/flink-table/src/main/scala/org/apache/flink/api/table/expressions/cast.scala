/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.apache.flink.api.table.expressions

import org.apache.flink.api.common.typeinfo.{BasicTypeInfo, TypeInformation}
import org.apache.flink.api.table.ExpressionException

case class Cast(child: Expression, tpe: TypeInformation[_]) extends UnaryExpression {
  def typeInfo = tpe match {
    case BasicTypeInfo.STRING_TYPE_INFO => tpe

    case b if b.isBasicType && child.typeInfo.isBasicType => tpe

    case _ => throw new ExpressionException(
      s"Invalid cast: $this. Casts are only valid betwixt primitive types.")
  }

  override def toString = s"$child.cast($tpe)"

  override def makeCopy(anyRefs: Seq[AnyRef]): this.type = {
    val child: Expression = anyRefs.head.asInstanceOf[Expression]
    copy(child, tpe).asInstanceOf[this.type]
  }
}
